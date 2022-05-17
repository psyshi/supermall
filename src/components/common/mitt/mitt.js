import mitt from 'mitt'

const emitter = mitt()

function setmitt(key) {
  emitter.emit(key)
}

function getmittvalue(key, value) {
  emitter.on(key, value)
}

function getmitt(key) {
  emitter.on(key)
}

export {setmitt ,getmitt , getmittvalue}