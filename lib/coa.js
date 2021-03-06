var Q = require('q'),
    PATH = require('path'),
    FS = require('./fs'),
    U = require('./util');

module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .title('Borschik. Extendable builder for text-based file formats.')
    .helpful()
    .opt()
        .name('version') .title('Version')
        .short('v').long('version')
        .flag()
        .only()
        .act(function() { return JSON.parse(FS.readFileSync(PATH.resolve(__dirname, '..', 'package.json'))).version })
        .end()
    .opt()
        .name('tech') .title('Technology')
        .short('t').long('tech')
        .end()
    .opt()
        .name('input').title('Input path')
        .short('i').long('input')
        .req()
        .end()
    .opt()
        .name('output').title('Output path')
        .short('o').long('output')
        .output()
        .req()
        .end()
    .opt()
        .name('freeze').title('Freeze links to static files (default: yes)')
        .short('f').long('freeze')
        .def(true)
        .val(function(v) {
            return U.stringToBoolean(v, true);
        })
        .end()
    .opt()
        .name('minimize').title('Minimize resulting content (default: yes)')
        .short('m').long('minimize')
        .def(true)
        .val(function(v) {
            return U.stringToBoolean(v, true);
        })
        .end()
    .act(function(opts) {

        var defTech = PATH.join(__dirname, 'tech.js'),
            tech = opts.tech,
            input = opts.input;

        if (!tech && typeof input === 'string') {
            tech = PATH.extname(input).substr(1);
        }

        if (!tech) {
            tech = defTech;
        }

        tech = PATH.basename(tech) === tech ?
            PATH.join(__dirname, 'techs', tech + '.js') :
            PATH.resolve(tech);

        return new (require(tech).Tech)(opts)
            .process(opts.input, opts.output);

    });
