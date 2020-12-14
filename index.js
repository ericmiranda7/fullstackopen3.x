const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))