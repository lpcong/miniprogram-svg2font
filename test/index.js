const path = require('path');
const svg2font = require('../index');

svg2font({
    src: path.join(__dirname, 'svg'),
    dest: path.join(__dirname, 'dest'),
    fontName: 'wsFont',
    publishConfig: {  // 文件发布配置
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
})