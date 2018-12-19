/*
 * @Author: andypliang 
 * @Date: 2018-12-15 14:59:40 
 * @Last Modified by: andypliang
 * @Last Modified time: 2018-12-19 19:41:04
 */

const fs = require('fs');
const path = require('path');
const svg2font = require('./src/svg2font');
const publishFile = require('./src/libs/publishFile');
const CONSTS = require('./src/libs/consts');

module.exports = function({ 
    src = CONSTS.src, 
    dest = CONSTS.dest, 
    fontName = CONSTS.fontName,
    publishConfig = CONSTS.publish
} = params) {
    svg2font({ src, dest, fontName }, (unicodes, fonts) => {
        // 注意小程序内不能直接引用本地字体文件，需上传到服务器
        publishFile(fonts, publishConfig, (remotePaths) => {
            let woff;
            let woff2;
            for (let path of remotePaths) {
                path.endsWith('.woff') && (woff = path);
                path.endsWith('.woff2') && (woff2 = path);
            }
            // 生成wxss文件和wxml文件 可根据需要进行调整对应内容
            let wxss = `@font-face {\n\tfont-family: ${fontName};\n\tsrc: url('${woff2}') format('woff2'), url('${woff}') format('woff');\n}\n.ws-icon {\n\tfont-family:'${fontName}'\n}`;
            let wxml = ``;
            for (let u in unicodes) {
                wxss += `\n.${u}:before {\n\tcontent:"\\${Number(unicodes[u].replace('&#', '').replace(';', '')).toString(16)}";\n}`;
                wxml += `<text class="${u} ws-icon" style="font-size:40rpx;color:gray;"></text>\n`;
            }
            fs.writeFileSync(path.join(dest, `${fontName}.wxss`), wxss, { encoding: 'utf8' });
            fs.writeFileSync(path.join(dest, `${fontName}.wxml`), wxml, { encoding: 'utf8' });
        });
        
    });
};