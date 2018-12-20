/*
 * @Author: andypliang 
 * @Date: 2018-12-15 14:59:40 
 * @Last Modified by: andypliang
 * @Last Modified time: 2018-12-20 20:49:20
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
        const maskComposition = (wxss) => {
            let wxml = ``;
            for (let u in unicodes) {
                wxss += `\n.${u}:before {\n\tcontent:"\\${Number(unicodes[u].replace('&#', '').replace(';', '')).toString(16)}";\n}`;
                wxml += `<text class="${u} ws-icon" style="font-size:40rpx;color:gray;"></text>\n`;
            }
            fs.writeFileSync(path.join(dest, `${fontName}.wxss`), wxss, { encoding: 'utf8' });
            fs.writeFileSync(path.join(dest, `${fontName}.wxml`), wxml, { encoding: 'utf8' });
        }
        // 注意小程序内不能直接引用本地字体文件，需上传到服务器，或者使用转base64本地使用
        if (!publishConfig.remoteDomain) {
            let woffPath;
            for (f of fonts) {
                if (f.endsWith('.woff')) {
                    woffPath = f;
                    break;
                }
            }
            let datas = fs.readFileSync(woffPath);
            // 使用base64方式
            maskComposition(`@font-face {\n\tfont-family: ${fontName};\n\tsrc: url('data:application/x-font-woff;charset=utf-8;base64,${new Buffer(datas).toString('base64')}') format('woff');\n}\n.ws-icon {\n\tfont-family:'${fontName}' !important\n}`);
        } else {
            publishFile(fonts, publishConfig, (remotePaths) => {
                let woff;
                let woff2;
                for (let p of remotePaths) {
                    p.endsWith('.woff') && (woff = p);
                    p.endsWith('.woff2') && (woff2 = p);
                }
                maskComposition(`@font-face {\n\tfont-family: ${fontName};\n\tsrc: url('${woff2}') format('woff2'), url('${woff}') format('woff');\n}\n.ws-icon {\n\tfont-family:'${fontName}' !important\n}`);
            });
        }
    });
};