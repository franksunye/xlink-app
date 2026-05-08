var common = require('./common.js');

const DOCUMENT_TYPE_NAMES = {
  quotation: '报价单',
  survey: '勘察单',
  acceptance: '验收报告',
  warranty: '质保单',
  contract: '合同'
};

const SUPPORTED_DOCUMENT_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

function sanitizeDocumentFileName(name) {
  return String(name || '文件')
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 60);
}

function limitDocumentNamePart(name, maxLength) {
  return sanitizeDocumentFileName(name).substring(0, maxLength);
}

function formatDocumentDate() {
  const date = new Date();
  const rawMonth = `${date.getMonth() + 1}`;
  const rawDay = `${date.getDate()}`;
  const month = rawMonth.length === 1 ? `0${rawMonth}` : rawMonth;
  const day = rawDay.length === 1 ? `0${rawDay}` : rawDay;
  return `${date.getFullYear()}${month}${day}`;
}

function formatDocumentTimestamp(value) {
  const source = value || new Date();
  const date = source instanceof Date ? source : new Date(String(source).replace(/-/g, '/'));
  if (isNaN(date.getTime())) {
    return formatDocumentDate();
  }
  const rawMonth = `${date.getMonth() + 1}`;
  const rawDay = `${date.getDate()}`;
  const rawHour = `${date.getHours()}`;
  const rawMinute = `${date.getMinutes()}`;
  const month = rawMonth.length === 1 ? `0${rawMonth}` : rawMonth;
  const day = rawDay.length === 1 ? `0${rawDay}` : rawDay;
  const hour = rawHour.length === 1 ? `0${rawHour}` : rawHour;
  const minute = rawMinute.length === 1 ? `0${rawMinute}` : rawMinute;
  return `${month}${day}${hour}${minute}`;
}

function getDocumentFileType(url) {
  const path = String(url || '').split('?')[0].toLowerCase();
  const match = path.match(/\.([a-z0-9]+)$/);
  const fileType = match ? match[1] : 'pdf';
  return SUPPORTED_DOCUMENT_TYPES.indexOf(fileType) !== -1 ? fileType : 'pdf';
}

function isImageFile(url) {
  const path = String(url || '').split('?')[0].toLowerCase();
  return (
    path.indexOf('.jpg') !== -1 ||
    path.indexOf('.jpeg') !== -1 ||
    path.indexOf('.png') !== -1 ||
    path.indexOf('.gif') !== -1
  );
}

function buildDocumentFileName(options) {
  const typeName = DOCUMENT_TYPE_NAMES[options.docType] || '文件';
  const bizId = limitDocumentNamePart(options.orderNum || formatDocumentDate(), 24);
  const customer = limitDocumentNamePart(options.customerName || '', 12);
  const timestamp = formatDocumentTimestamp(options.docTime);
  const nameParts = customer ? [typeName, bizId, customer, timestamp] : [typeName, bizId, timestamp];
  return `${nameParts.join('_')}.${options.fileType || 'pdf'}`;
}

function previewImage(url) {
  // #ifdef MP-WEIXIN
  wx.previewImage({
    current: url,
    urls: [url]
  });
  // #endif
  // #ifdef APP-PLUS
  uni.previewImage({
    current: url,
    urls: [url]
  });
  // #endif
}

// #ifdef MP-WEIXIN
function openWechatDocumentWithName(url, fileName, fileType) {
  wx.downloadFile({
    url,
    success: res => {
      if (res.statusCode !== 200) {
        console.log('downloadFile-status', res.statusCode);
        common.osg.toast('文件下载失败，请稍后重试', 'none');
        return;
      }
      const tempFilePath = res.tempFilePath;
      const targetPath = `${wx.env.USER_DATA_PATH}/${fileName}`;
      const fs = wx.getFileSystemManager();
      const openDocument = filePath => {
        wx.openDocument({
          filePath,
          showMenu: true,
          fileType: fileType || 'pdf',
          fail(err) {
            console.error('打开文件失败', err);
            common.osg.toast('文件打开失败，请稍后重试', 'none');
          }
        });
      };
      fs.unlink({
        filePath: targetPath,
        complete: () => {
          fs.saveFile({
            tempFilePath,
            filePath: targetPath,
            success: saveRes => {
              openDocument(saveRes.savedFilePath || targetPath);
            },
            fail: err => {
              console.error('保存失败', err);
              openDocument(tempFilePath);
            }
          });
        }
      });
    },
    fail(err) {
      console.log('downloadFile-err', err);
      common.osg.toast('文件下载失败，请稍后重试', 'none');
    }
  });
}
// #endif

// #ifdef APP-PLUS
function openAppDocument(url) {
  uni.showLoading({
    title: '正在打开'
  });
  plus.downloader
    .createDownload(url, {}, (d, status) => {
      uni.hideLoading();
      if (status == 200) {
        plus.runtime.openFile(d.filename, {}, error => {
          console.error('打开文件失败', error);
          common.osg.toast('打开文件失败，请检查文件格式或路径', 'none');
        });
      } else {
        plus.downloader.clear();
        common.osg.toast('文件下载失败，请稍后重试', 'none');
      }
    })
    .start();
}
// #endif

function openDocument(options) {
  const fileType = getDocumentFileType(options.url);
  // #ifdef MP-WEIXIN
  openWechatDocumentWithName(
    options.url,
    buildDocumentFileName({
      docType: options.docType,
      orderNum: options.orderNum,
      customerName: options.customerName,
      docTime: options.docTime,
      fileType
    }),
    fileType
  );
  // #endif
  // #ifdef APP-PLUS
  openAppDocument(options.url);
  // #endif
}

module.exports = {
  isImageFile,
  previewImage,
  openDocument,
  buildDocumentFileName
};
