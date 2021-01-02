const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(conn => {
    console.log('connected to ', process.env.MONGODB_URI)
})
.catch(error => {
    console.log('error ', error.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)