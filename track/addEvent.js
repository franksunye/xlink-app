// addEvent.js
import { replaceInFile } from 'replace-in-file';
import * as glob from 'glob';
import generateEventId from './generateEventId.js';
import { readFile, writeFile } from 'fs/promises';

// 定义文件匹配路径
// const files = glob.sync('./test.vue', { ignore: 'node_modules/**' });
// const files = glob.sync('{./business/pages/**/*.vue,./business/subpackages/**/*.vue,./business/subpackages2/**/*.vue}', { ignore: 'node_modules/**' });
// const files = glob.sync('{/Users/canlan/workspace/XLink/code/app/business/pages/**/*.vue,/Users/canlan/workspace/XLink/code/app/business/subpackages/**/*.vue,/Users/canlan/workspace/XLink/code/app/business/subpackages2/**/*.vue}', { ignore: 'node_modules/**' });
const files = glob.sync(
  '/Users/canlan/workspace/XLink/code/app/business/subpackages2/settleOptimiz/*.vue',
  {
    ignore: 'node_modules/**'
  }
);

// 定义需要添加 capture:false 的组件
const CAPTURE_FALSE_COMPONENTS = ['video', 'van-dialog', 'van-tabs', 'van-submit-bar'];

const hasClickEvent = match => {
  return (
    match.includes('@click') ||
    match.includes('@change') ||
    match.includes('@submit') ||
    match.includes('@play') ||
    match.includes('@pause') ||
    match.includes('@ended')
  );
};

const addEventToTag = async (match, useDataEvent = false) => {
  // 如果已经有 event 属性，直接返回
  if (match.includes(':event="{') || match.includes(':data-event="{')) {
    return match;
  }

  const eventId = await generateEventId();

  // 检查是否需要添加 capture:false
  const needCaptureFalse = CAPTURE_FALSE_COMPONENTS.some(component =>
    match.includes(`<${component}`)
  );
  const attrName = ':data-event="{id';
  const eventValue = needCaptureFalse
    ? `${attrName}:'${eventId}',capture:false`
    : `${attrName}:'${eventId}'`;

  // 处理自闭合标签
  if (match.trim().endsWith('/>')) {
    return match.replace(/\s*\/\s*>$/, ` ${eventValue}}" />`);
  }
  // 处理普通标签
  return match.replace(/\s*>$/, ` ${eventValue}}">`);
};

// 辅助函数：找到匹配的结束标签
const findMatchingEndTag = (content, tag, startIndex) => {
  let depth = 1;
  let currentIndex = startIndex;
  const tagName = tag.toLowerCase();

  while (depth > 0 && currentIndex < content.length) {
    const nextStart = content.indexOf(`<${tagName}`, currentIndex);
    const nextEnd = content.indexOf(`</${tagName}>`, currentIndex);

    if (nextEnd === -1) break;

    if (nextStart !== -1 && nextStart < nextEnd) {
      depth++;
      currentIndex = nextStart + 1;
    } else {
      depth--;
      currentIndex = nextEnd + tagName.length + 3;
    }
  }

  return currentIndex;
};

// 辅助函数：添加事件属性到单标签组件
const addEventAttributeToSelfClosing = (fullMatch, eventId, isVideo = false) => {
  const attrName = isVideo ? ':data-event' : ':event';
  // 处理不同形式的单标签结
  if (fullMatch.endsWith('/>')) {
    return fullMatch.replace('/>', ` ${attrName}="{id:'${eventId}'}"/>`);
  } else if (fullMatch.endsWith('/ >')) {
    return fullMatch.replace('/ >', ` ${attrName}="{id:'${eventId}'}"/ >`);
  } else if (fullMatch.includes(' /')) {
    return fullMatch.replace(' /', ` ${attrName}="{id:'${eventId}'}"/ `);
  }
  return fullMatch;
};

// 递归处理子组件
const processChildren = async (
  content,
  parentEventId,
  isOuterView = false,
  isInChangeTabs = false
) => {
  let processedContent = content;
  const processedTags = new Set();

  // 定义需要处理的组件列表
  const HANDLED_COMPONENTS = [
    'view',
    'text',
    'button',
    'video',
    'van-dialog',
    'van-tabs',
    'van-notice-bar',
    'van-grid-item',
    'van-submit-bar',
    'van-icon',
    'van-image',
    'van-button',
    'swiper-item',
    'image'
  ];

  // 检查组件是否需要处理事件
  const shouldHandleEvent = (tagName, fullTag) => {
    // 首先检查是否是需要处理的组件
    if (!HANDLED_COMPONENTS.includes(tagName)) {
      return false;
    }

    // 1. 处理点击事件
    if (hasClickEvent(fullTag)) {
      return true;
    }

    // 2. 特殊处理 van-dialog
    if (tagName === 'van-dialog' && !fullTag.includes('id="van-dialog"')) {
      return true;
    }

    // 3. 特殊处理 video 组件
    if (
      tagName === 'video' &&
      (fullTag.includes('@play') || fullTag.includes('@pause') || fullTag.includes('@ended'))
    ) {
      return true;
    }

    // 4. 特殊处理 van-tabs 的 change 事件
    if (tagName === 'van-tabs' && fullTag.includes('@change')) {
      return true;
    }

    return false;
  };

  // 统一的组件处理函数
  const processComponent = async (
    startIndex,
    tagName,
    content,
    parentId = null,
    parentHasClick = false
  ) => {
    console.log(`Processing ${tagName} at index ${startIndex}, parentId:`, parentId);

    let tagEndIndex = startIndex;
    let inQuotes = false;
    let quoteChar = '';
    let inDynamicAttr = false;
    let bracketCount = 0;
    let isSelfClosing = false;

    while (tagEndIndex < content.length) {
      const char = content[tagEndIndex];
      const nextChar = content[tagEndIndex + 1];

      if (!inQuotes && char === ':' && nextChar === '"') {
        inDynamicAttr = true;
        tagEndIndex++;
      } else if ((char === '"' || char === "'") && !inDynamicAttr) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
        }
      } else if (inDynamicAttr) {
        if (char === '{') bracketCount++;
        else if (char === '}') bracketCount--;
        else if (char === '"' && bracketCount === 0) {
          inDynamicAttr = false;
        }
      } else if (!inQuotes && !inDynamicAttr) {
        if (char === '/' && nextChar === '>') {
          isSelfClosing = true;
          tagEndIndex++;
          break;
        } else if (char === '>') {
          break;
        }
      }

      tagEndIndex++;
    }
    tagEndIndex++;

    const fullTag = content.substring(startIndex, tagEndIndex);
    let newEventId = null;
    let shouldAddEvent = false;
    const isDialog = tagName === 'van-dialog';

    // 检查是否需要添加 event 属性
    const hasDataEvent = fullTag.includes(':data-event="{');

    if (!hasDataEvent) {
      // 检查是否需要处理事件
      if (shouldHandleEvent(tagName, fullTag)) {
        newEventId = await generateEventId();
        shouldAddEvent = true;
      }
      // 继承父组件eventId（当父组件有点击事件且不是dialog的子组件时）
      else if (parentId && !isDialog && (parentHasClick || hasParentEventId(content, startIndex))) {
        newEventId = parentId;
        shouldAddEvent = true;
      }

      if (shouldAddEvent) {
        console.log(`Adding data-event to ${tagName} with id:`, newEventId);
        const attrName = ':data-event="{id';
        // 检查是否需要添加 capture:false
        const needCaptureFalse = CAPTURE_FALSE_COMPONENTS.includes(tagName);
        const eventValue = needCaptureFalse
          ? `${attrName}:'${newEventId}',capture:false`
          : `${attrName}:'${newEventId}'`;

        const replacement = isSelfClosing
          ? fullTag.replace(/\s*\/\s*>$/, ` ${eventValue}}" />`)
          : fullTag.replace(/\s*>$/, ` ${eventValue}}">`);

        processedContent =
          processedContent.slice(0, startIndex) + replacement + processedContent.slice(tagEndIndex);

        processedTags.add(startIndex);
      }
    } else {
      // 如果已经有相应属性，检查是否需要添加 capture:false
      const eventMatch = fullTag.match(/:data-event="{([^}]+)}"/);
      if (eventMatch) {
        const eventContent = eventMatch[1];
        const idMatch = eventContent.match(/id:'([^']+)'/);
        if (idMatch) {
          newEventId = idMatch[1];

          // 检查是否需要添加 capture:false
          if (
            CAPTURE_FALSE_COMPONENTS.includes(tagName) &&
            !eventContent.includes('capture:false')
          ) {
            const updatedEventContent = `${eventContent},capture:false`;
            const replacement = fullTag.replace(
              /:data-event="{[^}]+}"/,
              `:data-event="{${updatedEventContent}}"`
            );

            processedContent =
              processedContent.slice(0, startIndex) +
              replacement +
              processedContent.slice(tagEndIndex);

            processedTags.add(startIndex);
          }
        }
      }
    }

    return {
      tagEndIndex,
      eventId: newEventId,
      hasClickEvent: shouldHandleEvent(tagName, fullTag) || (parentHasClick && !isDialog)
    };
  };

  // 检查父元素是否有 event 属性
  const hasParentEventId = (content, startIndex) => {
    const previousContent = content.substring(0, startIndex);
    const lastOpenTag = previousContent.lastIndexOf('<');
    if (lastOpenTag === -1) return false;

    const tagContent = content.substring(lastOpenTag, startIndex);
    return tagContent.includes(':data-event="{id:');
  };

  // 修改组件匹配模式，只匹配指定的组件
  const componentPattern = new RegExp(`<(${HANDLED_COMPONENTS.join('|')})([^>]*?)>`, 'g');
  let match;

  while ((match = componentPattern.exec(processedContent)) !== null) {
    const startIndex = match.index;
    if (processedTags.has(startIndex)) continue;

    const {
      tagEndIndex,
      eventId,
      hasClickEvent: currentHasClick
    } = await processComponent(
      startIndex,
      match[1],
      processedContent,
      parentEventId,
      parentEventId !== null
    );

    if (!match[0].endsWith('/>')) {
      // 处理子组件
      const closeTag = `</${match[1]}>`;
      const closeTagIndex = findMatchingEndTag(processedContent, match[1], tagEndIndex);

      if (closeTagIndex > tagEndIndex) {
        const childContent = processedContent.slice(tagEndIndex, closeTagIndex);
        console.log(`Processing children of ${match[1]} with parentId:`, eventId);
        // 传递 eventId 给子组件，除非是 dialog 的子组件
        const shouldPassEventId = eventId && match[1] !== 'van-dialog';
        const processedChildContent = await processChildren(
          childContent,
          shouldPassEventId ? eventId : null,
          false,
          isInChangeTabs
        );
        processedContent =
          processedContent.slice(0, tagEndIndex) +
          processedChildContent +
          processedContent.slice(closeTagIndex);
      }
    }
  }

  return processedContent;
};

// 辅助函数：检查是否在多行属性值中
const isInMultilineAttribute = (content, position) => {
  const prevNewline = content.lastIndexOf('\n', position);
  const nextNewline = content.indexOf('\n', position);
  if (prevNewline === -1 || nextNewline === -1) return false;

  const currentLine = content.substring(prevNewline + 1, nextNewline).trim();
  return currentLine.startsWith(':') && !currentLine.endsWith('"');
};

const processScriptContent = async content => {
  let processedContent = content;
  const dialogApiPattern = /Dialog\.(confirm|alert|close)\s*\(\s*{[\s\S]*?}\s*\)/g;

  let match;
  while ((match = dialogApiPattern.exec(content)) !== null) {
    const fullMatch = match[0];

    // 检查是否已有 dataEvent
    if (!fullMatch.includes('dataEvent:')) {
      const eventId = await generateEventId();
      // 修改替换模式，将逗号放在上一行
      const replacement = fullMatch
        .replace(/}(?=\s*\))/, `, dataEvent: {id:'${eventId}'}}`)
        .replace(/,(\s*dataEvent)/, ',$1'); // 确保逗号在上一行
      processedContent = processedContent.replace(fullMatch, replacement);
    }
  }

  return processedContent;
};

// 执行替换
(async () => {
  try {
    for (const file of files) {
      let content = await readFile(file, 'utf8');

      // 1. 理 template 部分
      // 先找到 <template> 标签
      const templateStart = content.indexOf('<template>');
      if (templateStart !== -1) {
        // 从 <template> 之后开始查找第一个非注释的 <view>
        const templateContent = content.slice(templateStart);
        const viewPattern = /<view[^>]*?>/g;
        const commentPattern = /<!--[\s\S]*?-->/g;

        // 移除所有注释
        const contentWithoutComments = templateContent.replace(commentPattern, '');

        // 查找第一个 view 标签
        const viewMatch = viewPattern.exec(contentWithoutComments);
        if (viewMatch) {
          const originalView = viewMatch[0];
          let updatedView = originalView;

          if (!updatedView.includes('@click.capture="track"')) {
            updatedView = originalView.replace('>', ' @click.capture="track">');
          }

          // 在原始内容中定位并替换第一个 view 标签
          const firstViewIndex = content.indexOf(originalView, templateStart);
          if (firstViewIndex !== -1) {
            content =
              content.slice(0, firstViewIndex) +
              updatedView +
              content.slice(firstViewIndex + originalView.length);

            const viewEndIndex = content.indexOf('</template>');
            if (viewEndIndex !== -1) {
              const viewContent = content.slice(firstViewIndex + updatedView.length, viewEndIndex);
              const processedContent = await processChildren(viewContent, null, true, false);
              content =
                content.slice(0, firstViewIndex + updatedView.length) +
                processedContent +
                content.slice(viewEndIndex);
            }
          }
        }
      }

      // 处理 script 部分
      const scriptStart = content.indexOf('<script>');
      const scriptEnd = content.indexOf('</script>');

      if (scriptStart !== -1 && scriptEnd !== -1) {
        console.log('Found script section');
        const scriptContent = content.slice(scriptStart + 8, scriptEnd);
        const processedScriptContent = await processScriptContent(scriptContent);
        content =
          content.slice(0, scriptStart + 8) + processedScriptContent + content.slice(scriptEnd);
      }

      await writeFile(file, content, 'utf8');
    }
    console.log('Replacement completed.');
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();
