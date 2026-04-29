import { pickExclude, isPC, isWxWork } from '../common/utils';
import { isImageUrl, isVideoUrl } from '../common/validator';
export function isImageFile(item) {
    if (item.isImage != null) {
        return item.isImage;
    }
    if (item.type) {
        return item.type === 'image';
    }
    if (item.url) {
        return isImageUrl(item.url);
    }
    return false;
}
export function isVideoFile(item) {
    if (item.isVideo != null) {
        return item.isVideo;
    }
    if (item.type) {
        return item.type === 'video';
    }
    if (item.url) {
        return isVideoUrl(item.url);
    }
    return false;
}
function formatImage(res) {
    return res.tempFiles.map((item) => (Object.assign(Object.assign({}, pickExclude(item, ['path'])), { type: 'image', url: item.tempFilePath || item.path, thumb: item.tempFilePath || item.path })));
}
function formatVideo(res) {
    return [
        Object.assign(Object.assign({}, pickExclude(res, ['tempFilePath', 'thumbTempFilePath', 'errMsg'])), { type: 'video', url: res.tempFilePath, thumb: res.thumbTempFilePath }),
    ];
}
function formatMedia(res) {
    return res.tempFiles.map((item) => (Object.assign(Object.assign({}, pickExclude(item, ['fileType', 'thumbTempFilePath', 'tempFilePath'])), { type: item.fileType, url: item.tempFilePath, thumb: item.fileType === 'video' ? item.thumbTempFilePath : item.tempFilePath })));
}
function formatFile(res) {
    return res.tempFiles.map((item) => (Object.assign(Object.assign({}, pickExclude(item, ['path'])), { url: item.path })));
}
export function chooseFile({ accept, multiple, capture, compressed, maxDuration, sizeType, camera, maxCount, mediaType, extension, }) {
    return new Promise((resolve, reject) => {
        switch (accept) {
            case 'image':
                // 上传文件时增加“从工单相册选择”选项
                let itemList = ['拍摄', '从手机相册选择'];
                // 获取当前页面
                const pages = getCurrentPages();
                const page = pages[pages.length-1];
                // 解决App端获取不到page.data的问题
                const isApp = typeof plus !== 'undefined';
                if(isApp){
                    page.data = page.$vm.$data;
                }
                if((page.route.endsWith('serviceAppointment') && (page.data.openForm || page.data.signForm.show))||page.route.endsWith('logDetails')){
                    let colName = page.data.currentColName;
                    
                    if (colName) {
                          // 工单相册标签有当前表单
                        if(page.data.opts.albumLabel.find(item => item.value == colName)){
                            itemList.push('从工单相册选择')
                        }
                    }else{
                        itemList.push('从工单相册选择')
                    }
                  
                   
                }
                wx.showActionSheet({
                    itemList,
                    success: res => {
                        if (!res.cancel) {
                            if (res.tapIndex == 2) {
                                // 弹窗工单相册
                                page.$vm.albumShow();
                                return;
                            } else {
                                if(res.tapIndex == 0){
                                    capture = ['camera']
                                } else {
                                    capture = ['album'];
                                }
                                if (isPC || isWxWork || isApp) {
                                    wx.chooseImage({
                                        count: multiple ? Math.min(maxCount, 9) : 1,
                                        sourceType: capture,
                                        sizeType,
                                        success: (res) => resolve(formatImage(res)),
                                        fail: reject,
                                    });
                                } else {
                                    // App不支持
                                    wx.chooseMedia({
                                        count: multiple ? Math.min(maxCount, 9) : 1,
                                        mediaType: ['image'],
                                        sourceType: capture,
                                        maxDuration,
                                        sizeType,
                                        camera,
                                        success: (res) => resolve(formatImage(res)),
                                        fail: reject,
                                    });
                                }
                            }
                        }
                    }
                });
                break;
            case 'media':
                wx.chooseMedia({
                    count: multiple ? Math.min(maxCount, 9) : 1,
                    mediaType,
                    sourceType: capture,
                    maxDuration,
                    sizeType,
                    camera,
                    success: (res) => resolve(formatMedia(res)),
                    fail: reject,
                });
                break;
            case 'video':
                wx.chooseVideo({
                    sourceType: capture,
                    compressed,
                    maxDuration,
                    camera,
                    success: (res) => resolve(formatVideo(res)),
                    fail: reject,
                });
                break;
            default:
                wx.chooseMessageFile(Object.assign(Object.assign({ count: multiple ? maxCount : 1, type: accept }, (extension ? { extension } : {})), { success: (res) => resolve(formatFile(res)), fail: reject }));
                break;
        }
    });
}
