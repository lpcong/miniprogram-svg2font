/*
 * @Author: andypliang 
 * @Date: 2018-12-18 19:16:28 
 * @Last Modified by: andypliang
 * @Last Modified time: 2018-12-19 18:43:35
 */

const fs = require('fs');
const path = require('path');
const CONSTS = require('./consts');
const COS = require('cos-nodejs-sdk-v5');

module.exports = function(src, publishConfig, cb) {
    if (!src || src.length === 0) throw new Error(`empty upload source: ${err}`);
    const config = publishConfig.config || {};
    const cos = new COS({
        SecretId: config.SecretId,
        SecretKey: config.SecretKey
    });
    const results = [];
    const promises = [];
    const upload = (filePath, fileName) => {
        return new Promise((resolve) => {
            if (!publishConfig.remoteDomain) {
                results.push(fileName);
                resolve();
                return;
            }
            cos.sliceUploadFile({
                Bucket: config.Bucket,
                Region: config.Region,
                Key: `${publishConfig.remotePath}${fileName}`,
                FilePath: filePath
            }, (err) => {
                if (err) {
                    console.log(`upload ${fileName} fail`);
                    results.push(fileName);
                    resolve();
                    return;
                };
                const remoteFile = `${publishConfig.remoteDomain}${publishConfig.remotePath}${fileName}`;
                console.log('publish done:', remoteFile);
                results.push(remoteFile);
                resolve();
            });
        });
    }
    if (!publishConfig.remoteDomain) {
        console.log(`上传配置为空，可在/miniprogram-svg2font/src/libs/consts.js中加入你的上传配置`);
    }
    typeof src === 'string' && (src = [src]);
    for (let s of src) {
        const fileName = path.basename(s);
        promises.push(upload(s, fileName));
    }
    Promise.all(promises).then(() => {
        cb && cb(results.length === 1 ? results[0] : results);
    });
}