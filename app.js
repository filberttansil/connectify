const express = require('express')
const app = express()
const port = 3000
const {Controller} = require('./controllers/controller')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true}))

app.get('/', Controller.testing)

app.listen(port , ()=>{
    console.log('sudah berhasil baca port')
})
