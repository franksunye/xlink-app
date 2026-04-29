import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';

// 定义需要添加 capture:false 的组件
const CAPTURE_FALSE_COMPONENTS = ['video', 'van-dialog', 'van-tabs', 'van-submit-bar'];

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

// 检查是否有点击事件
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

// 检查组件是否需要处理事件
const shouldHandleEvent = (tagName, fullTag) => {
  // 首先检查是否是需要处理的组件
  if (!HANDLED_COMPONENTS.includes(tagName)) {
    return false;
  }

  // 跳过带有 @click.capture="track" 的组件
  if (fullTag.includes('@click.capture="track"')) {
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

const checkFiles = async () => {
  try {
    // const files = glob.sync(
    //   '{./business/pages/**/*.vue,./business/subpackages/**/*.vue,./business/subpackages2/**/*.vue}',
    //   { ignore: 'node_modules/**' }
    // );
    const files = glob.sync(
      '/Users/canlan/workspace/XLink/code/app/business/subpackages2/settleOptimiz/*.vue',
      { ignore: 'node_modules/**' }
    );

    let output = '检查结果报告\n\n';
    let totalMissing = 0;

    for (const file of files) {
      const content = await readFile(file, 'utf8');
      let filePrinted = false;
      let fileMissingCount = 0;

      // 检查每个组件
      for (const component of HANDLED_COMPONENTS) {
        const componentPattern = new RegExp(`<${component}[\\s\\S]*?>`, 'g');
        let match;

        while ((match = componentPattern.exec(content)) !== null) {
          const fullTag = match[0];

          // 跳过已有 data-event 的组件
          if (fullTag.includes(':data-event="{')) {
            continue;
          }

          // 检查是否需要添加事件
          if (shouldHandleEvent(component, fullTag)) {
            if (!filePrinted) {
              output += `\n文件: ${file}\n`;
              filePrinted = true;
            }

            // 获取组件的上下文
            const startIndex = Math.max(0, match.index - 50);
            const endIndex = Math.min(content.length, match.index + fullTag.length + 50);
            const context = content.slice(startIndex, endIndex);

            output += `\n缺少 data-event 的 ${component} 组件:\n`;
            output += fullTag + '\n';
            output += '\n上下文:\n';
            output += context + '\n';
            output +=
              '\n需要添加: ' +
              (CAPTURE_FALSE_COMPONENTS.includes(component)
                ? 'data-event (capture:false)'
                : 'data-event') +
              '\n';
            output += '-------------------\n';

            totalMissing++;
            fileMissingCount++;
          }
        }
      }

      if (fileMissingCount > 0) {
        output += `\n此文件共有 ${fileMissingCount} 个组件需要添加 data-event\n\n`;
      }
    }

    output += `\n检查完成！共发现 ${totalMissing} 个需要添加 data-event 的组件\n`;

    // 生成带时间戳的文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `check-result-${timestamp}.txt`;

    // 写入文件
    await writeFile(fileName, output, 'utf8');
    console.log(`检查完成！结果已保存到文件: ${fileName}`);
    console.log(`共发现 ${totalMissing} 个需要添加 data-event 的组件`);
  } catch (error) {
    console.error('Error:', error);
  }
};

checkFiles();
