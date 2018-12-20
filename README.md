# miniprogram-svg2font

svg图标转换成适合小程序内使用的图标字体和对应的wxss文件

## 安装
```javascript
npm install --save-dev miniprogram-svg2font
```

## 使用
```javascript
const path = require('path');
const svg2font = require('miniprogram-svg2font');

svg2font(opts);
```

opts是可选的配置参数，具体如下：
### src：
svg列表目录，default：当前目录下的svg目录

### dest：
生成字体图标和对应wxss样式文件的目标目录，default：当前目录下的dest目录

### fontName：
字体名称，default：miniprogram-font

### publishConfig：
选填，文件发布的配置，不填会生成本地base64引用。**小程序内样式文件不能直接引用本地字体文件，需发布到服务器或本地引用base64**，本例中使用的是腾讯云的对象存储。如有其它需要可重写src/libs/publishFile文件
**发布字体文件到服务器引用需要服务器支持跨域访问字体，不然安卓机下会看到字体图标是乱码**

完整调用例子：
```javascript
const path = require('path');
const svg2font = require('miniprogram-svg2font');

svg2font({
    fontName: 'testFont', // 字体名称
    src: path.join(__dirname, 'svg'), // svg列表目录
    dist: path.join(__dirname, 'dist'), // 生成图标字体文件目录
    publishConfig: {  // 文件发布配置 可选，不使用则生成本地base64引用
        remoteDomain: '', // 服务器域名，eg：https://cdn.com/
        remotePath: '', // 文件发布远程目录路径，eg: xxx/xxx/
        config: { // 腾讯云对象存储配置，说明文档：https://cloud.tencent.com/document/product/436/8629
            AppId: '',
            SecretId: '',
            SecretKey: '',
            Bucket: '',
            Region: ''
        }
    }
});
```
生成的文件包含woff、woff2及对应的wxss样式，**由于小程序是在微信的webview环境中运行，且对手机系统和微信版本均有要求，只需用woff和woff2即可做到字体图标访问的全兼容**
