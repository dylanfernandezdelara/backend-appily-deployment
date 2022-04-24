import { Request, Response, Router } from "express";
import { User } from "../models";
import { IUser } from "../types";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy, IVerifyOptions } from "passport-local";
import { CallbackError, NativeError } from "mongoose";

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY || "placeholder"
}, function verify(token, done){
  try{
    return done(null, token);
  }
  catch(e){
    done(e);
  }
}
));

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
}, function verify(username, password, done){
  User.findOne({ "email": username }, (err: NativeError, userMatch: IUser) => {
    if(err){
      return done(err);
    }
    if(!userMatch){
      return done(null, false, { message: "Incorrect username." });
    }
    if(!userMatch.checkPassword(password)){
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, userMatch);
  });
}
));

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  passport.authenticate("local", {session: false}, (err: Error, user: IUser, info: IVerifyOptions) => {
    if(err || !user){
      return res.status(400).send(info ? info.message : "An error occurred.");
    }
    req.login(user, {session: false}, (err) => {
      if(err){
        return res.status(500).send("An error occurred.");
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY || "placeholder");
      
      return res.send(token);
    });
  })
  (req, res);
});

// Create new account
router.post("/register", (req: Request, res: Response) => {
  const { email, password } = req.body;
  User.findOne({ "email": email }, (err: NativeError, userMatch: IUser) => {
    if (userMatch) {
      return res.status(409).send(`Email ${email} already taken.`);
    }
    const newUser = new User({
      "email": email,
      "password": password
    });
    newUser.save((err: CallbackError, savedUser: IUser) => {
      if (err) return res.status(500).send("A database error occurred.");
      return res.json(savedUser);
    });
  });
});

export default router;
