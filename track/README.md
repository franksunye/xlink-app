# 项目文件说明

本项目包含多个 JavaScript 文件，每个文件负责不同的功能。以下是各个文件的详细说明：

## 1. `generateEventId.js`

该文件定义了 `generateIds` 函数，使用 `nanoid` 库生成唯一的 ID。该函数可以在其他文件中被导入并调用，以生成所需的 ID。

## 2. `updateDataEvent.js`

该文件负责更新 Vue 组件文件中的事件 ID。它读取指定的 Vue 文件，生成多个 ID，并在特定的标签中插入 `data-event` 属性。更新的文件包括：

- `serviceAppointment.vue`
- `logDetails.vue`

## 3. `addEvent.js`

该文件用于在多个 Vue 文件中添加事件属性。它使用 `replace-in-file` 和 `glob` 库查找匹配的组件，并为需要的组件添加 `data-event` 属性。该文件支持递归处理子组件，并确保在适当的情况下添加 `capture:false`。

## 4. `checkMissingEvents.js`

该文件用于检查项目中的 Vue 组件，查找缺少 `data-event` 属性的组件。它会生成一份报告，列出所有需要添加 `data-event` 的组件，并将结果保存到一个文本文件中。

## 使用说明

- 确保安装了所需的依赖库，例如 `nanoid` 和 `glob`。
- 运行 `updateDataEvent.js` 来更新 Vue 文件中的事件 ID。
- 运行 `addEvent.js` 来为 Vue 文件中的组件添加事件属性。
- 运行 `checkMissingEvents.js` 来检查项目中缺少的事件属性，并生成报告。

## 注意事项

- 在运行这些脚本之前，请确保备份您的文件，以防止意外的数据丢失。
- 根据项目的具体需求，您可能需要调整文件路径和正则表达式匹配模式。
