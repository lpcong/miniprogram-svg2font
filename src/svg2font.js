/*
 * @Author: andypliang 
 * @Date: 2018-12-14 16:59:08 
 * @Last Modified by: andypliang
 * @Last Modified time: 2018-12-16 00:27:28
 */

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const SVGIcons2SVGFontStream = require('svgicons2svgfont');
const svg2ttf = require('svg2ttf');
const ttf2woff = require('ttf2woff');
const ttf2woff2 = require('ttf2woff2');
const { deleteFiles } = require('./libs/utils');
const unicodes = {};
let ttfBuffers;

/**
 * 字符串转unicode
 * @param {string} name 
 */
function getIconUnicode(name) {
	if (!name) return false;
	let _num = 1;
	for (let i = 0; i < name.length; i++) {
		_num *= name.charCodeAt(i);
	}
	while (_num > 59999) {
		_num = _num / 10;
	}
	if (_num < 10000) _num += 10000;
	_num = parseInt(_num);
    unicodes[name] = '&#' + _num + ';'
    return [String.fromCharCode(+_num)];
}

/**
 * 获取svg文件列表
 * @param {String} src svg文件目录
 */
function initSvgs(src) {
    const files = fs.readdirSync(src, 'utf8');
    const result = [];
    if (!files) {
        throw new Error(`空的SVG目录：${src}`);
    }
    for (let i in files) {
        if (typeof files[i] !== 'string' || path.extname(files[i]) !== '.svg') continue;
        result.push(path.join(src, files[i]));
    }
    return result;
}

/**
 * svg icon转svg字体
 * @param {object} params
 */
function svgIconToSvgFont({ fontName, dest, svgList } = params) {
    return new Promise((resolve, reject) => {
        try {
            const fontStream = new SVGIcons2SVGFontStream({ fontName });
            const svgPath = path.join(dest, `${fontName}.svg`);
            mkdirp.sync(dest, function (err) {
                if (err) throw new Error(`创建目录异常: ${err}`);
            });

            // Setting the font destination
            fontStream.pipe(fs.createWriteStream(svgPath))
                .on('finish', function () {
                    resolve(svgPath);
                })
                .on('error', function (err) {
                    throw new Error(`svg icon转svg字体 error：${err}`);
                });

            for (let s of svgList) {
                const glyph = fs.createReadStream(s);
                const name = path.basename(s).split('.')[0];
                glyph.metadata = {
                    unicode: getIconUnicode(name),
                    name
                };
                fontStream.write(glyph);
            }
            fontStream.end();
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * svg font转ttf文件
 * @param {string} srcFile svg font文件路径
 */
function svgTottf(svgFile) {
    return new Promise((resolve, reject) => {
        try {
            const ttf = svg2ttf(fs.readFileSync(svgFile, 'utf8'));
            const ttfPath = svgFile.replace('.svg', '.ttf');
            fs.writeFileSync(ttfPath, ttf.buffer);
            ttfBuffers = new Buffer(ttf.buffer);
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * ttf转woff文件
 * @param {string} srcFile ttf文件路径
 */
function ttfTowoff(srcFile) {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(srcFile, new Buffer(ttf2woff(ttfBuffers).buffer));
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * ttf转woff2文件
 * @param {string} srcFile ttf文件路径
 */
function ttfTowoff2(srcFile) {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(srcFile, new Buffer(ttf2woff2(ttfBuffers).buffer));
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = function ({ src, dest, fontName } = params, cb) {
    const svgList = initSvgs(src);
    const svgFile = path.join(dest, `${fontName}.svg`);
    svgIconToSvgFont({
        svgList,
        fontName,
        dest
    }).then(() => {
        svgTottf(svgFile);
    }).then(() => {
        Promise.all([ttfTowoff(svgFile.replace('.svg', '.woff')), ttfTowoff2(svgFile.replace('.svg', '.woff2'))]).then(() => {
            // 操作完成 移除多余svg和ttf文件
            deleteFiles([svgFile, svgFile.replace('.svg', '.ttf')]);
            cb && cb(unicodes);
        });
    }).catch((err) => {
        throw new Error(`convert error：${err}`);
    });
}