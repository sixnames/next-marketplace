import bcrypt from 'bcryptjs';
import { User, UserModel } from '../entities/User';
import { GraphQLLocalStrategy } from 'graphql-passport';
import passport from 'passport';

passport.serializeUser(function (user: User, done) {
  done(null, user);
});

passport.deserializeUser(function (user: User, done) {
  done(null, user);
});

passport.use(
  new GraphQLLocalStrategy((email: any, password: any, done: any) => {
    UserModel.findOne({ email }, (e, user) => {
      if (e || !user) {
        new Error('no matching user');
      }
      const error = user ? null : new Error('no matching user');

      bcrypt.compare(password, `${user?.password}`, (err, success) => {
        if (err || !success) {
          done(error, success);
          return;
        }
        const document = user?.toJSON();
        done(error, {
          id: `${user?._id}`,
          ...document,
        });
      });
    });
  }),
);

export default passport;
