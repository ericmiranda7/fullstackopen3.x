require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const Phonebook = require('./models/phonebook')
const morgan = require('morgan')
morgan.token('data', req => {
    return JSON.stringify(req.body)
})
const morganApp = morgan(':method :url :status :res[content-length] - :response-time ms :data')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morganApp)

app.get('/', (request, response) => {
    response.send('hi there')
})

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(phonebook => response.json(phonebook))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Phonebook.findById(id)
        .then(person => {
            if (person) response.json(person)
            else response.status(404).end()
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Phonebook.count()
        .then(res => {
            response.send(`<p>Phonebook has info for ${res} people</p> ${date}`)
        })
    const date = new Date()
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Phonebook.findByIdAndRemove(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    Phonebook.find({ name: body.name }).then(() => {
        const person = new Phonebook({
            name: body.name,
            number: body.number,
        })

        person.save()
            .then(saved => saved.toJSON())
            .then(jsonSave => response.json(jsonSave))
            .catch(error => next(error))
    })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    const person = {
        name: request.body.name,
        number: request.body.number,
    }

    Phonebook.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unkownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unkown endpoint' })
}
app.use(unkownEndPoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') response.status(400).send({ error: 'malformatted id' })
    else if (error.name === 'ValidationError') return response.status(400).json({ error: error.message })
    else if (error.name === 'MongoError') return response.status(400).json({ error: error.message })
    else next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))