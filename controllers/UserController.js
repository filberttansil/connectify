const {User} = require('../models')
const bcrypt = require('bcryptjs')

class UserController{
    
    static registerForm(req,res){
        res.render('register.ejs')
    }

    static postRegisterForm(req,res){
        const {username, email, password} = req.body 
        User.create({username, email, password ,role:'costumer'})
        .then(newUser =>{
            res.redirect('/login')
        })
        .catch(err =>{
            res.send(err)
        })
        console.log(req.body)
        // res.send('halo')
        } 

        static loginForm(req,res){
            const {error} = req.query
            res.render('loginform.ejs', {error})
            // res.send('halo')
        }

        static postLogin(req,res){
            console.log(req.body)
                const {username, password} = req.body
                User.findOne({where : {username}})
                .then(user => {
                    // console.log(user)
                    if(user){
                        const isValidPassword = bcrypt.compareSync(password, user.password)
        
                        if(isValidPassword){
                            console.log(req.session)
                            req.session.userId = user.id
                             
                            res.redirect('/home')
                        } else {
                            const error = "invalid username/password"
                            return res.redirect(`/login?error=${error}`)
        
                        }
                    } else{
                        const error = "invalid username/password"
                        return res.redirect(`/login?error=${error}`)
                    }
                })
                .catch(err => res.send(err))
            }


}

module.exports = UserController