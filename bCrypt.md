1. command awal

```
npm i bcryptjs //untuk hash Password
npm i express-session // untuk autentification
```

1. Register

A. Bikin model user

```
nps sequelize model:generate --name User --attributes username:string,password:string,role:string

npx sequelize db:migrate
```
B. BIKIN GET /Login dan Post/register

```js
app.get('/register', UserController.registerForm)
app.post('/register', UserController.postRegister)
app.get('/login', UserController.registerForm)
app.get('/logout', UserController.getLogout)
```

bikin UserController di folder COntroller

```js
const {User} = require('../models')
const bcryptjs = require('bcryptjs')

class UserController{

    static registerForm(req,res){
        res.render('register.ejs')
    }

    static postRegisterForm(req,res){
    const {username, password, role} = request.body 
    User.create({username, password, role})
    .then(newUser =>{
        res.redirect('/loginform.ejs')
    })
    .catch(err =>{
        res.send(err)
    })
    } 

    static loginForm(req,res){
        const {error} = req.query
        res.render('loginform.ejs', {error})
    }

    static postLogin(req,res){
    //findOne user dari username
    //kalau user ada compare plain password apakah sama dengan hash password(di db)
    //kalau gak sama gak boleh masuk ke home, keluar eror
    //kalau password sesuai maka redirect ke home
        const {username, password} = req.body
        User.findOne({where : {username }})
        .then(user => {
            if(user){
                const isValidPassword = bcrypt.compareSync(password, user.password)

                if(isValidPassword){
                    req.sessions.userId = user.id //untuk pemanggilan Session nya di controller
                    return res.redirect('/')
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
module.exports =UserController
```

require di apps.js 
```js
const UserController = require(`../controllers/UserController`)
```


SAMBUNGKAN KE EJS
```HTML
<form action="/register" method="post">
```

DI MODEL 
```js
//untuk di register
const bcrypt = require('bcryptjs')
//untuk nge hash

//untuk di login
bcrypt.compareSync("<password>", hash) // untuk compare

//bikin hooks di atas sequelize, modelName: 'user'
hooks: {
    beforeCreate(instance, options){
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(instance.password, salt) 

        instance.password = hash
    }
}
```
2. login
A. BIKIN POST LOGIN
```JS
app.post('/register', UserController.postLogin)
```
B. BIKIN STATIC POSTLOGIN DI CONTROLLER
```JS
di controller atas penjelasanya
```
C. ubah action form di EJS 
```html
<form action="/login" method="post">
```
D KIRIM NOTIFIKASI DI FORM LOGIN KALAU ERROR
```HTML
<% if(err){%>
<p style = "color:red"><%= error %></p>
<%}%>
```


3. pemakaian Midleware+ session untuk authentifikasi sudah login atau belum
dan pemakaian middlewate + session untuk authentifikasi row/owner


A. install npm install-session

B. panggil express-session 
```js
const session = require('express-session') // coba lihat di contoh apps atas
```
C. tambahkan middleware di bawah app.use(middleware lain nya) 
```js
//proses ngasi tau kalau kita siap menggunakan middlewarenya
app.use(session({
    secret: 'rahasia dong', //harus ada
    resave: false,
    saveUninitialized: false,
    coockie: {
        secure: false,
        sameSite: true //untuk security dari csrf attack
        }
}))

``` 

D. tambahkan session di app.js di bawah proses login
```js
router.use(function (req, res, next){
    console.log(req.session)
    if(!req.session.userId){
        const error = 'PLEASE LOGIN FIRST!' //kalau belum ada sesion kasi tau harus login 
        res.redirect('/login?error=$(error') //balikin ke home 
    }
    else{
        next()
    }
})
```

E. INI KALAU CASE NYA ADMIN
```js
// secara global
router.use(function (req, res, next) {
    if(req.session.userId && req.session.role === 'admin'){
        const error = 'you have no access'
        res.redirect (`/login?error=${error}`)
    } else{
        next()
    }
})// yang berada di bawah ini pasti kena karna ini Session global

// secara satu persatu
const isAdmin = function (req, res, next) {
    if(req.session.userId && req.session.role === 'admin'){
        const error = 'you have no access'
        res.redirect (`/login?error=${error}`)
    } else{
        next()
    }
} // nanti pasang satu satu dimana kita mau taruh, di antara end point dan controller 
// contoh:
app.get('/author/add', isAdmin, AuthorController.getauthor)
```

F. UNTUK LOG OUT
```js
app.get('/logout', UserController.getLogout)
```
controller logout 
```js
static getLogout(req, res){
    req.session.destroy(err) => {
        if (err) console.log(err)
        else{
            res.redirect('/login')
        }
    }
} 
// jangan lupa buat tombol logout nya di navbar
```

4. pindahkan middleware ke folder seperti helper
5. pindahkan juga bycrpt ke helper

