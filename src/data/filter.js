const words = require('./got.json')

const newWords = words.filter((w) => {
  return w.length < 5
})

console.log(JSON.stringify(newWords))