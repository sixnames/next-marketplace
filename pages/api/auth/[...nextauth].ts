import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { ISR_ONE_WEEK } from 'lib/config/common';
import { COL_USERS } from 'db/collectionNames';
import { UserModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';

const options: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: ISR_ONE_WEEK,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.JWT_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
        authKey: { label: 'auto', type: 'string' },
      },
      authorize: async (credentials) => {
        try {
          const { db } = await getDatabase();
          const collection = db.collection<UserModel>(COL_USERS);

          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await collection.findOne({ email: credentials.email });

          if (user) {
            const passwordResult = await bcrypt.compare(credentials.password, `${user.password}`);

            if (!passwordResult) {
              return Promise.resolve(null);
            }

            return Promise.resolve({
              name: user.name,
              email: user.email,
            });
          } else {
            return Promise.resolve(null);
          }
        } catch (e) {
          console.log('NextAuthOptions.providers.authorize', e);
          return Promise.resolve(null);
        }
      },
    }),
  ],
};

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
