#!/usr/bin/env node

'use strict';
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const svg2font = require('../index');
const dirname = process.cwd();
const version = require('../package.json').version;

if (argv.v || argv.version) {
    console.log(`v${version}`);
} else if (argv._ && argv._.length) {
    let _src = argv._[0],
        _dist = argv._[1] || _src;
    svg2font({
        src: path.join(dirname, _src),
        dist: path.join(dirname, _dist),
        fontName: argv.n || argv.name
    });
} else {
    console.log([
        'usage: svgs2fonts [src] [dist] [options]',
        '',
        'options: -n   --name   iconfont name(default: miniprogram-font)'
    ].join('\n'));
    process.exit();
}