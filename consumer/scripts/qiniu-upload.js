/**
 * 七牛云图片覆盖上传与 CDN 刷新脚本
 * 
 * 使用方法:
 * 1. 复制 qiniu-config.json.example 为 qiniu-config.json 并填写 AK/SK/Bucket
 * 2. 确保安装了 qiniu 依赖: npm install qiniu
 * 3. 运行脚本: node qiniu-upload.js <本地文件路径> [远程文件名]
 * 
 * 示例:
 * node qiniu-upload.js ../static/images/new_banner.jpg newDeclaration2.jpg
 */

const qiniu = require('qiniu');
const fs = require('fs');
const path = require('path');

// 读取配置文件
const configPath = path.join(__dirname, 'qiniu-config.json');
if (!fs.existsSync(configPath)) {
    console.error('错误: 找不到配置文件 qiniu-config.json。请参考 qiniu-config.json.example 创建并补全信息。');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const { accessKey, secretKey, bucket, cdnDomain } = config;

// 获取命令行参数
const localFile = process.argv[2];
let remoteKey = process.argv[3];

if (!localFile) {
    console.log('用法: node qiniu-upload.js <本地文件路径> [远程文件名]');
    process.exit(1);
}

// 如果没有指定远程文件名，默认使用本地文件名
if (!remoteKey) {
    remoteKey = path.basename(localFile);
}

// 检查本地文件是否存在
if (!fs.existsSync(localFile)) {
    console.error(`错误: 本地文件不存在 - ${localFile}`);
    process.exit(1);
}

// 初始化鉴权
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 构建上传策略 (覆盖上传)
const options = {
    scope: `${bucket}:${remoteKey}`,
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

// 开始上传
const qiniuConfig = new qiniu.conf.Config();
// 可以在这里指定机房区域，例如 z0 表示华东
// qiniuConfig.zone = qiniu.zone.Zone_z0; 

const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
const putExtra = new qiniu.form_up.PutExtra();

console.log(`正在上传 [${localFile}] 到 [${remoteKey}]...`);

formUploader.putFile(uploadToken, remoteKey, localFile, putExtra, function (respErr, respBody, respInfo) {
    if (respErr) {
        console.error('上传出错:', respErr);
        return;
    }
    if (respInfo.statusCode === 200) {
        console.log('✅ 上传成功:', respBody);
        
        // 刷新 CDN 缓存
        refreshCDN(remoteKey);
    } else {
        console.error('❌ 上传失败 (状态码:', respInfo.statusCode, '):', respBody);
    }
});

/**
 * 刷新 CDN 缓存
 */
function refreshCDN(key) {
    const cdnManager = new qiniu.cdn.CdnManager(mac);
    const urlsToRefresh = [
        `${cdnDomain}/${key}`
    ];
    
    console.log(`正在刷新 CDN 缓存: ${urlsToRefresh[0]}...`);
    
    cdnManager.refreshUrls(urlsToRefresh, function (err, respBody, respInfo) {
        if (err) {
            console.error('CDN 刷新出错:', err);
            return;
        }
        if (respInfo.statusCode === 200) {
            console.log('✅ CDN 刷新成功。由于 CDN 延迟，请在 1-5 分钟后查看效果。');
        } else {
            console.error('❌ CDN 刷新失败 (状态码:', respInfo.statusCode, '):', respBody);
        }
    });
}
