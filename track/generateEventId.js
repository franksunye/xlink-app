import { nanoid } from 'nanoid';
// import clipboardy from 'clipboardy';

async function generateIds() {
  const id = nanoid(10); // 生成10字符长的ID
  return id;
  // console.log(`eventId: ${id}`);
  // // 将所有ID复制到剪切板，以逗号分隔
  // await clipboardy.write(ids.join(', '));
}

export default generateIds;  