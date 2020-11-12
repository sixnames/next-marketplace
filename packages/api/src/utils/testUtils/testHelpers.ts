import fs from 'fs';
import path from 'path';
import { testClient } from '../../test/jest.setup';
import { StringOrAst, TestQuery, TestSetOptions } from 'apollo-server-integration-testing';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../config';
import { DEFAULT_CITY, DEFAULT_LANG } from '@yagu/config';
import { User } from '../../entities/User';
import mime from 'mime-types';
import { gql } from 'apollo-server-express';
import { Upload } from '../../types/upload';

interface WithUserMutationInterface {
  mutate: TestQuery;
  query: TestQuery;
  setOptions: TestSetOptions;
}

interface AuthenticatedUserMutationInterface {
  mutate: TestQuery;
  query: TestQuery;
  user: User | null;
  setOptions: TestSetOptions;
}

interface GetTestClientWithUserInterface {
  city?: string;
  lang?: string;
}

export async function testClientWithContext(
  args?: GetTestClientWithUserInterface,
): Promise<WithUserMutationInterface> {
  const { city = DEFAULT_CITY, lang = DEFAULT_LANG } = args || {
    city: DEFAULT_CITY,
    lang: DEFAULT_LANG,
  };

  const { setOptions, mutate, query } = testClient;

  const session = {
    user: null,
    userId: null,
    roleId: null,
    destroy: (callback: (arg: any) => void) => {
      session.user = null;
      session.userId = null;
      session.roleId = null;
      callback(null);
    },
  };

  setOptions({
    request: {
      city,
      lang,
      defaultLang: DEFAULT_LANG,
      session,
    },
  });

  return { mutate, query, setOptions };
}

interface AuthenticatedTestClient {
  email: string;
  password: string;
}

export async function authenticatedTestClient(
  props?: AuthenticatedTestClient,
): Promise<AuthenticatedUserMutationInterface> {
  const { mutate, query, setOptions } = await testClientWithContext();
  const { email, password } = props || {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  };

  const {
    data: {
      signIn: { user },
    },
  } = await mutate<any>(
    gql`
      mutation SignIn($input: SignInInput!) {
        signIn(input: $input) {
          success
          message
          user {
            id
            itemId
            name
            shortName
            fullName
            role {
              id
              nameString
              description
              slug
              isStuff
              rules {
                nameString
                entity
                restrictedFields
                operations {
                  operationType
                  allow
                  customFilter
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        input: {
          email,
          password,
        },
      },
    },
  );

  return { mutate, query, user, setOptions };
}

interface GetTestStreamsInterface {
  dist?: string;
  fileNames?: string[];
}

interface MutateInterface extends GetTestStreamsInterface {
  mutation: StringOrAst;
  input: (files: Promise<Upload>[]) => void;
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
