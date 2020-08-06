import fs from 'fs';
import path from 'path';
import { testClient } from '../../../test/setup';
import { TestQuery, TestSetOptions } from 'apollo-server-integration-testing';
import { ADMIN_EMAIL, ADMIN_PASSWORD, DEFAULT_CITY, DEFAULT_LANG } from '../../config';
import { User, UserModel } from '../../entities/User';
import mime from 'mime-types';
import { Upload } from '../../types/upload';

interface WithUserMutationInterface {
  mutate: TestQuery;
  query: TestQuery;
  user: User | null;
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

export async function getTestClientWithUser({
  city = DEFAULT_CITY,
  lang = DEFAULT_LANG,
}: GetTestClientWithUserInterface): Promise<WithUserMutationInterface> {
  const user = await UserModel.findOne({
    email: ADMIN_EMAIL,
  });

  const { setOptions, mutate, query } = testClient;

  setOptions({
    request: {
      city,
      lang,
      defaultLang: DEFAULT_LANG,
      session: {},
    },
  });

  return { mutate, query, user, setOptions };
}

export async function getTestClientWithAuthenticatedUser(): Promise<
  AuthenticatedUserMutationInterface
> {
  const { mutate, query, setOptions } = await getTestClientWithUser({});

  const {
    data: {
      signIn: { user },
    },
  } = await mutate(
    `
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
            id
            nameString
            entity
            restrictedFields
            operations {
              id
              operationType
              allowed
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
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
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
  mutation: string;
  input: (files: Promise<Upload>[]) => void;
}

async function getTestStreams({
  fileNames = ['test-image-0.png', 'test-image-1.png', 'test-image-2.png'],
  dist = './test',
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
    const { mutate } = await getTestClientWithAuthenticatedUser();

    return await mutate(mutation, {
      variables: {
        input: input(files),
      },
    });
  } catch (e) {
    console.log(e);
  }
}
