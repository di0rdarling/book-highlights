import bcrypt from "bcrypt";
import User from "../models/schemas/usersSchema";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { CallbackError } from "mongoose";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: CallbackError, user: any) => {
    done(err, user);
  });
});

passport.use(User.createStrategy());

//Local Stratery (email and password) Authentication
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  (email, password, done) => {
    //Match User
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'This email is not registered' })
        } else {
          //Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Wrong password" });
            }
          });
        }
      })
      .catch((err) => {
        return done(null, false, { message: err });
      });
  })
);

export default passport;
