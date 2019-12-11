const {JSDOM, VirtualConsole}  = require('jsdom')

global.initDom = (htmlFile) => {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('log', (...args) => {console.log(`&${args}`)})
    return JSDOM.fromFile(htmlFile, {
        runScripts: 'dangerously',
        resources: 'usable',
        virtualConsole
    })
}