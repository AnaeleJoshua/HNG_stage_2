

const logEvents = require('./logEvents');
const EventEmitter = require('events')

class Emitter extends EventEmitter {};

// initialize object 
const myEmitter = new Emitter();
console.log('my name is jo')
myEmitter.on('log',(msg,fileName)=>logEvents(msg,fileName))


// throw new Error('my new generated error')
// myEmitter.emit('log',`${req.url}\t${req.method}`,reqLog.txt)


// myEmitter.emit('log',`${err.name}\t${-err.message}`,errorLog.txt)