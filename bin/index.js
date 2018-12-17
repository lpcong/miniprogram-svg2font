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
    let src = argv._[0],
        dest = argv._[1] || src;
    svg2font({
        src: path.join(dirname, src),
        dest: path.join(dirname, dest),
        fontName: argv.n || argv.name
    });
} else {
    console.log([
        'usage: svgs2fonts [src] [dest] [options]',
        '',
        'options: -n   --name   iconfont name(default: miniprogram-font)'
    ].join('\n'));
    process.exit();
}