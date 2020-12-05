import fs from 'fs';
import path from 'path';
import {
  createTestClient,
  StringOrAst,
  TestQuery,
  TestSetOptions,
} from 'apollo-server-integration-testing';
import { ADMIN_EMAIL } from '../../config';
import { DEFAULT_CITY, DEFAULT_LANG, ROLE_SLUG_GUEST } from '@yagu/config';
import { User, UserModel } from '../../entities/User';
import mime from 'mime-types';
import { ApolloServer } from 'apollo-server-express';
import { Upload } from '../../types/upload';
import { buildSchema } from 'type-graphql';
import { schemaOptions } from '../../schema/schema';
import { RoleRuleModel, RoleRuleOperationModel } from '../../entities/RoleRule';
import { RoleModel } from '../../entities/Role';

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
        getUser: () => authUser,
        authenticate: (_arg?: any) => {
          return { user: authUser };
        },
      };
    },
  });
  const testClient = createTestClient({
    apolloServer,
  });
  const { mutate, query, setOptions } = testClient;

  // Set request role
  const roleRuleOperationsPopulate = {
    path: 'operations',
    model: RoleRuleOperationModel,
    options: {
      sort: {
        order: 1,
      },
    },
  };

  let role;
  let roleRules;

  if (authUser) {
    let userRole = await RoleModel.findOne({ _id: authUser.role });
    if (!userRole) {
      userRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    }

    if (!userRole) {
      throw Error('Guest role not found for request user');
    }

    role = userRole;
    roleRules = await RoleRuleModel.find({
      roleId: userRole.id,
    }).populate(roleRuleOperationsPopulate);
  } else {
    const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      throw Error('Guest role not found');
    }

    role = guestRole;
    roleRules = await RoleRuleModel.find({
      roleId: guestRole.id,
    }).populate(roleRuleOperationsPopulate);
  }

  setOptions({
    request: {
      defaultLang: DEFAULT_LANG,
      lang,
      city,
      role,
      roleRules,
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
