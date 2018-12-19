const path = require('path');
const svg2font = require('../index');

svg2font({
    src: path.join(__dirname, 'svg'),
    dest: path.join(__dirname, 'dest'),
    fontName: 'ws-iconfont'
})