import bcrypt from "bcrypt";
import User from "../models/schemas/usersSchema";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { CallbackError } from "mongoose";
import logger from '../logging/logger';
import { Strategy, ExtractJwt } from 'passport-jwt';

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
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  (email, password, done) => {
    logger.info('passport.authenticate.login.called')
    //Match User
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          logger.error('passport.authenticate.login.fail')
          logger.error('passport.authenticate.login.no.user.found')
          return done(null, false, { message: 'This email is not registered' })
        } else {
          //Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              logger.info('passport.authenticate.login.success')
              return done(null, user);
            } else {
              logger.error('passport.authenticate.login.fail')
              logger.error('passport.authenticate.login.incorrect.password')
              return done(null, false, { message: "Wrong password" });
            }
          });
        }
      })
      .catch((err) => {
        logger.error('passport.authenticate.login.fail')
        return done(null, false, { message: err });
      });
  })
);


passport.use('jwt',
  new Strategy(
    {
      secretOrKey: 'TOP_SECRET', //TODO: Move to config? Linked to token in usersService.
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token')
    },
    async (token: any, done: any) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
