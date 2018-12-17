/*
 * @Author: andypliang 
 * @Date: 2018-12-15 14:59:40 
 * @Last Modified by: andypliang
 * @Last Modified time: 2018-12-16 00:27:48
 */

const fs = require('fs');
const path = require('path');
const svg2font = require('./src/svg2font');
const CONSTS = require('./src/libs/consts');

module.exports = function({ 
    src = CONSTS.src, 
    dest = CONSTS.dest, 
    fontName = CONSTS.fontName 
} = params) {
    svg2font({ src, dest, fontName }, (unicodes) => {
        // 生成wxss文件和wxml文件 此处根据各人需要进行调整
        // 注意小程序内不能直接引用本地字体文件，需上传到服务器
        let wxss = `@font-face{font-family:${fontName};src:url('${fontName}.woff2') format('woff2'),url('${fontName}.woff') format('woff');}.ws-icon{font-family:'${fontName}'}`;
        let wxml = ``;
        for (let u in unicodes) {
            wxss += `.${u}:before{content:"\\${Number(unicodes[u].replace('&#', '').replace(';', '')).toString(16)}";}`;
            wxml += `<text class="${u} ws-icon" style="font-size:40rpx;color:gray;font-style:normal;display:inline-block;"></text>`;
        }
        fs.writeFileSync(path.join(dest, `${fontName}.wxss`), wxss, { encoding: 'utf8' });
        fs.writeFileSync(path.join(dest, `${fontName}.wxml`), wxml, { encoding: 'utf8' });
    });
};