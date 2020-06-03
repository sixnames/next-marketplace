import fs from 'fs';
import path from 'path';
import { testClient } from '../../../test/setup';
import { TestQuery, TestSetOptions } from 'apollo-server-integration-testing';
import { ADMIN_EMAIL, ADMIN_PASSWORD, DEFAULT_CITY, DEFAULT_LANG } from '../../config';
import { User, UserModel } from '../../entities/User';

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

export const getTestClientWithUser = async ({
  city = DEFAULT_CITY,
  lang = DEFAULT_LANG,
}: GetTestClientWithUserInterface): Promise<WithUserMutationInterface> => {
  const user = await UserModel.findOne({
    email: ADMIN_EMAIL,
  });

  const { setOptions, mutate, query } = testClient;

  setOptions({
    request: {
      session: {
        city,
        lang,
      },
    },
  });

  return { mutate, query, user, setOptions };
};

export const getTestClientWithAuthenticatedUser = async (): Promise<
  AuthenticatedUserMutationInterface
> => {
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
        role
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
};

interface MutateInterface {
  mutation: string;
  input: Function;
}

export const mutateWithImages = async ({ mutation, input }: MutateInterface): Promise<any> => {
  try {
    const filename = 'test-image-0.jpg';
    const file = fs.createReadStream(path.resolve(`./test/${filename}`));

    const image = new Promise((resolve) =>
      resolve({
        createReadStream: () => file,
        stream: file,
        filename: filename,
        mimetype: `image/jpg`,
      }),
    );

    const { mutate } = await getTestClientWithAuthenticatedUser();

    return await mutate(mutation, {
      variables: {
        input: input(image),
      },
    });
  } catch (e) {
    console.log(e);
  }
};
