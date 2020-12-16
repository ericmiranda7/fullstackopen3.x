const express = require('express')
const app = express()
const morgan = require('morgan')
const morganApp = morgan('tiny')
app.use(express.json())
app.use(morganApp)
//morgan.token('data', (req, res) => req.body)



let notes = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040"
    },
    {
        id: 2,
        name: "Ada",
        number: "020",
    },
    {
        id: 3,
        name: "Jaden",
        number: "331",
    },
]

app.get('/', (request, response) => {
    response.send('hi there');
})

app.get('/api/persons', (request, response) => {
    response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id == id)
    if (note) return response.json(note)
    response.status(404).end()
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${notes.length} people</p> ${date}`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = +request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const id = Math.floor(Math.random() * 1000)

    const exists = notes.find(note => note.name === body.name) ? true : false

    if (!body.number || !body.name) return response.status(400).json({error: "name or number missing"})
    if (exists) return response.status(400).json({error: "Name already exists"})

    const note = {
        name: body.name,
        number: body.number,
        id: id
    }

    notes = notes.concat(note)

    response.json(note)
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))