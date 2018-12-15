const path = require('path');
const svg2font = require('../index');

svg2font({
    src: path.join(__dirname, 'svg'),
    dist: path.join(__dirname, 'dist'),
    fontName: 'testFont'
})