const mongoose  = require('mongoose')
const Schema = mongoose.Schema
const testSchema = new Schema({
  serverName: String,
  serverOwners: [String],
  updated: {type: Date, default: Date.now}
})
const test = mongoose.model('Test', testSchema)
const Test = new test()
export interface CBStorage {
}

export class CBStorage {
    constructor() {
      mongoose.connect('mongodb://cb-data/test-mongo', {useNewUrlParser: true})
        .then(() => console.log("Mongo Connected"))
        .catch(err => console.log(err))
      //this.awaiter(Test.save())
      //console.log(Test)
    }

    /*async awaiter(awaited) {
      await(awaited)
    }*/
}

