const {} = require('../models/index')
const {Op} = require("sequelize")

class Controller{
    static testing(req, res){
        res.send('ini testing')
    }
}

module.exports = {Controller}