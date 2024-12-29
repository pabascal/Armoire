import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // How to extract the token
  secretOrKey: process.env.JWT_SECRET, // Secret for verifying the token
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id); // Find the user by ID in the token
      if (!user) {
        return done(null, false); // User not found
      }
      return done(null, user); // User found
    } catch (error) {
      return done(error, false); // Error in finding user
    }
  }),
);

export default passport;