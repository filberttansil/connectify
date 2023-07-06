const { User, Profile } = require("../models");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const nodemailer = require('nodemailer');

  
    
class UserController {
  static registerForm(req, res) {
    res.render("register.ejs");
  }

  static postRegisterForm(req, res) {
    const { username, email, password, name } = req.body;
    User.create({ username, email, password, role: "Costumer" })
      .then((newUser) => {
        const UserId = newUser.id;
        return Profile.create({ name, UserId });
      })
      .then(() => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ppconnectify@gmail.com',
              pass: 'yrsebvwrfiicvcmy'
            }
          });
          const mailOptions = {
            from: 'ppconnectify@gmail.com',
            to: `${email}`,
            subject: 'Test Email',
            text: 'Hello, this is a test email.'
          };
        
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.redirect("/login");
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static loginForm(req, res) {
    const { error } = req.query;
    res.render("loginform.ejs", { error });
    // res.send('halo')
  }

  //   static postLogin(req, res) {
  //     console.log(req.body);
  //     const { username, password } = req.body;
  //     User.findOne({ where: { username } })
  //       .then((user) => {
  //         // console.log(user)
  //         if (user) {
  //           const isValidPassword = bcrypt.compareSync(password, user.password);

  //           if (isValidPassword) {
  //             // console.log(req.session)
  //             req.session.userId = user.id;
  //             req.session.role = user.role;

  //             res.redirect("/home");
  //           } else {
  //             const error = "invalid username/password";
  //             return res.redirect(`/login?error=${error}`);
  //           }
  //         } else {
  //           const error = "invalid username/password";
  //           return res.redirect(`/login?error=${error}`);
  //         }
  //       })
  //       .catch((err) => res.send(err));
  //   }

  static postLogin(req, res) {
    console.log(req.body);
    const { username, password } = req.body;
    User.findOne({ where: { username } })
      .then((user) => {
        // console.log(user)
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password);

          if (isValidPassword) {
            // console.log(req.session)
            req.session.userId = user.id;
            req.session.role = user.role;

            res.redirect("/home");
          } else {
            const error = "invalid username/password";
            return res.redirect(`/login?error=${error}`);
          }
        } else {
          const error = "invalid username/password";
          return res.redirect(`/login?error=${error}`);
        }
      })
      .catch((err) => res.send(err));
  }

  static admin(req, res) {
    Profile.findAll().then((profile) => {
      console.log(profile, 12345);
      res.render("admin", { profile });
    });
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) console.log(err);
      else {
        res.redirect("/login");
      }
    });
  }

  static deleteProfile(req, res){
    const {id} = req.params
    console.log(id,213)
    Profile.destroy({
        where :{
            id: +id
        }
    })
    .then(()=>{
        res.redirect("/admin")
    })
  }
}


module.exports = UserController;
