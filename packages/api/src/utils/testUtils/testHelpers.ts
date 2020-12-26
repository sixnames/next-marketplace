import fs from 'fs';
import path from 'path';
import {
  createTestClient,
  StringOrAst,
  TestQuery,
  TestSetOptions,
} from 'apollo-server-integration-testing';
import { ADMIN_EMAIL } from '../../config';
import { User, UserModel } from '../../entities/User';
import mime from 'mime-types';
import { ApolloServer } from 'apollo-server-express';
import { Upload } from '../../types/upload';
import { buildSchema } from 'type-graphql';
import { schemaOptions } from '../../schema/schema';
import bcrypt from 'bcryptjs';
import { DEFAULT_CITY, DEFAULT_LANG } from '@yagu/shared';

export interface TestClientInterface {
  query: TestQuery;
  mutate: TestQuery;
  setOptions: TestSetOptions;
}

interface GetTestClientWithUserInterface {
  city?: string;
  lang?: string;
  headers?: any;
  isAuthenticated?: boolean;
  isUnauthenticated?: boolean;
  authUser?: User;
}

export async function testClientWithContext(
  args?: GetTestClientWithUserInterface,
): Promise<TestClientInterface> {
  const {
    city = DEFAULT_CITY,
    lang = DEFAULT_LANG,
    headers,
    isAuthenticated,
    isUnauthenticated,
    authUser,
  } = args || {
    city: DEFAULT_CITY,
    lang: DEFAULT_LANG,
    headers: undefined,
    isAuthenticated: false,
    isUnauthenticated: true,
  };

  // Create apollo server
  const schema = await buildSchema(schemaOptions);
  const apolloServer = new ApolloServer({
    schema,
    context: (ctx) => {
      return {
        ...ctx,
        isAuthenticated: () => isAuthenticated,
        isUnauthenticated: () => isUnauthenticated,
        login: (user?: User) => user,
        logout: () => true,
        getUser: () => authUser,
        authenticate: (_type?: string, arg?: any) => {
          const { email, password } = arg;
          if (email !== authUser?.email) {
            return { user: null };
          }

          bcrypt.compare(password, `${authUser?.password}`, (err, success) => {
            if (err || !success) {
              throw Error('Wrong password');
            }
          });

          return { user: authUser };
        },
      };
    },
  });
  const testClient = createTestClient({
    apolloServer,
  });
  const { mutate, query, setOptions } = testClient;

  setOptions({
    request: {
      defaultLang: DEFAULT_LANG,
      lang,
      city,
      headers,
    },
  });

  return { mutate, query, setOptions };
}

interface AuthenticatedTestClient
  extends Omit<GetTestClientWithUserInterface, 'isAuthenticated' | 'isUnauthenticated'> {
  email?: string;
  cartId?: string;
}

interface AuthenticatedTestClientInterface extends TestClientInterface {
  authUser: User;
}

export async function authenticatedTestClient(
  props?: AuthenticatedTestClient,
): Promise<AuthenticatedTestClientInterface> {
  const { email = ADMIN_EMAIL, cartId } = props || {
    email: ADMIN_EMAIL,
  };

  const authUser = await UserModel.findOne({ email }).lean().exec();

  if (!authUser) {
    throw Error('authUser not found');
  }

  const id = authUser._id.toString();
  const testClient = await testClientWithContext({
    isAuthenticated: true,
    isUnauthenticated: false,
    authUser: {
      ...authUser,
      id,
    },
  });

  return {
    ...testClient,
    authUser: {
      ...authUser,
      id,
      cart: cartId,
    },
  };
}

interface GetTestStreamsInterface {
  dist?: string;
  fileNames?: string[];
}

async function getTestStreams({
  fileNames = ['test-image-0.png', 'test-image-1.png', 'test-image-2.png'],
  dist = './src/test',
}: GetTestStreamsInterface) {
  return fileNames.map((filename) => {
    const filePath = `${dist}/${filename}`;
    const file = fs.createReadStream(path.resolve(filePath));
    const mimetype = `${mime.lookup(filePath)}`;

    return new Promise<Upload>((resolve) =>
      resolve({
        createReadStream: () => file,
        filename: filename,
        encoding: 'UTF-8',
        mimetype,
      }),
    );
  });
}

interface MutateInterface extends GetTestStreamsInterface {
  mutation: StringOrAst;
  input: (files: Promise<Upload>[]) => void;
}

export async function mutateWithImages({
  mutation,
  input,
  dist,
  fileNames,
}: MutateInterface): Promise<any> {
  try {
    const files = await getTestStreams({ dist, fileNames });
    const { mutate } = await authenticatedTestClient();

    return await mutate(mutation, {
      variables: {
        input: input(files),
      },
    });
  } catch (e) {
    console.log(e);
  }
}
