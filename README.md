# miniprogram-svg2font

svg图标转换成适合小程序内使用的图标字体文件和对应的wxss

## 安装
```javascript
npm install --save-dev miniprogram-svg2font
```

## 使用
```javascript
const path = require('path');
const svg2font = require('miniprogram-svg2font');

svg2font({
    fontName: 'testFont', // 字体名称
    src: path.join(__dirname, 'svg'), // svg列表目录
    dist: path.join(__dirname, 'dist') // 生成图标字体文件目录
})
```

## 文档待补充