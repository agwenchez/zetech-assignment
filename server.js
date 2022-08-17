const express = require('express')
const app = express()
const cors = require('cors');
const logger = require('morgan')
app.use(logger('dev'))

const port = process.env.PORT || 8000;
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).send('Zetech backend routes')
})

// import routes
app.use('/hod', require('./routes/hod'))

app.listen(port, () => {
    console.log(`App running on port: ${port}.`)
})