require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const Phonebook = require('./models/phonebook')
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

const morgan = require('morgan')
const { Mongoose } = require('mongoose')
morgan.token('data', (req, res) => {
    return JSON.stringify(req.body)
})
const morganApp = morgan(':method :url :status :res[content-length] - :response-time ms :data')
app.use(morganApp)

app.get('/', (request, response) => {
    response.send('hi there');
})

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(phonebook => response.json(phonebook))
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Phonebook.findById(id).then(person => response.json(person))
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p> ${date}`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = +request.params.id
    Phonebook.findById(id).then(person => response.json(person))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    /* const exists = Phonebook.find({name: body.name}) ? true : false

    if (!body.number || !body.name) return response.status(400).json({error: "name or number missing"})
    if (exists) return response.status(400).json({error: "Name already exists"}) */

    const person = new Phonebook({
        name: body.name,
        number: body.number,
    })

    person.save().then(saved => {
        response.json(saved)
        console.log('saved')
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))