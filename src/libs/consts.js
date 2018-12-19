/*
 * @Author: andypliang 
 * @Date: 2018-12-14 17:13:49 
 * @Last Modified by: andypliang
 * @Last Modified time: 2018-12-19 17:25:00
 */
 
module.exports = {
    fontName: 'miniprogram-font',
    src: 'svg',
    dest: 'dest',
    publish: { 
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
};