import {
  testClientWithContext,
  authenticatedTestClient,
} from '../../../utils/testUtils/testHelpers';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../../config';
import { max, alex } from '../__fixtures__';
import { RoleModel } from '../../../entities/Role';
import { UserModel } from '../../../entities/User';
import { gql } from 'apollo-server-express';
import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { ROLE_SLUG_GUEST } from '@yagu/shared';

const { email, password, phone, name } = max;

describe('User', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should Auth user', async () => {
    const authUser = await UserModel.findOne({ email: ADMIN_EMAIL }).lean().exec();

    if (!authUser) {
      throw Error('authUser not found');
    }

    const id = authUser._id.toString();
    const { mutate } = await testClientWithContext({
      authUser: {
        ...authUser,
        id,
      },
    });

    // User shouldn't signIn if user not found
    const signInNotFoundPayload = await mutate<any>(gql`
      mutation {
        signIn(
          input: {
            email: "fake@mail.com",
            password: "${password}"
          }
        )
        { success }
      }
    `);
    expect(signInNotFoundPayload.data.signIn.success).toBeFalsy();

    // User shouldn't signIn on Email validation error
    const { errors: signInEmailErrors } = await mutate<any>(gql`
      mutation {
        signIn(
          input: {
            email: "fake@g",
            password: "${password}"
          }
        )
        { success }
      }
    `);
    expect(signInEmailErrors).toBeDefined();

    // User shouldn't signIn if is wrong Password
    const { errors: signInPasswordErrors } = await mutate<any>(gql`
      mutation {
        signIn(
          input: {
            email: "${email}",
            password: "fake"
          }
        )
        { success }
      }
    `);
    expect(signInPasswordErrors).toBeDefined();

    // User should signIn
    const signInPayload = await mutate<any>(
      gql`
        mutation SignIn($input: SignInInput!) {
          signIn(input: $input) {
            success
            message
            user {
              id
              name
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
    expect(signInPayload.data.signIn.success).toBeTruthy();
    expect(signInPayload.data.signIn.user.id).toEqual(id);

    // User should sign out
    const authenticatedClient = await authenticatedTestClient();
    const signOutPayload = await authenticatedClient.mutate<any>(gql`
      mutation {
        signOut {
          success
          message
        }
      }
    `);
    expect(signOutPayload.data.signOut.success).toBeTruthy();
  });

  it('Should CRUD user', async () => {
    const user = await UserModel.findOne({
      email: ADMIN_EMAIL,
    });
    if (!user) {
      throw Error('Test user not found');
    }

    const { mutate, query } = await authenticatedTestClient();

    // User should sign up
    const {
      data: { signUp },
    } = await mutate<any>(gql`
          mutation {
            signUp(
              input: {
                name: "${name}",
                phone: "${phone}",
                email: "${email}",
                password: "${password}"
              }
            ) {
              success
              user { id }
            }
          }
        `);
    expect(signUp.user.id).not.toBeNull();
    expect(signUp.success).toBeTruthy();

    const role = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    if (!role) {
      throw Error('guest role not found');
    }
    // Should create new user
    const createUserPayload = await mutate<any>(gql`
          mutation {
            createUser(
              input: {
                email: "${alex.email}",
                name: "${alex.name}",
                phone: "${alex.phone}",
                role: "${role.id}",
              }
            ) {
             success
             message
             user {
               id
               email
               phone
             }
           }
          }
        `);
    const {
      data: { createUser },
    } = createUserPayload;
    const createdUser = createUser.user;
    expect(createUser.success).toBeTruthy();
    expect(createdUser.email).toEqual(alex.email);

    // Should update user
    const {
      data: { updateUser },
    } = await mutate<any>(gql`
          mutation {
            updateUser(
              input: {
                id: "${createdUser.id}",
                email: "${alex.email}",
                name: "${alex.name}",
                phone: "${createdUser.phone}",
                role: "${role.id}",
              }
            ) {
              success
              user {
               id
               email
               name
               phone
              }
           }
          }
        `);
    const updatedUser = updateUser.user;
    expect(updateUser.success).toBeTruthy();
    expect(updatedUser.id).toEqual(createdUser.id);
    expect(updatedUser.email).toEqual(alex.email);
    expect(updatedUser.name).toEqual(alex.name);
    expect(updatedUser.phone).toEqual(createdUser.phone);

    // Should return current user
    const {
      data: { getUser },
    } = await query<any>(gql`
          query {
            getUser(id: "${updatedUser.id}") {
             id
             name
            }
          }
        `);
    expect(getUser.id).toEqual(updatedUser.id);
    expect(getUser.name).toEqual(updatedUser.name);

    // Should delete user
    const {
      data: { deleteUser },
    } = await mutate<any>(gql`
          mutation {
            deleteUser(id: "${updatedUser.id}") { success }
          }
        `);
    expect(deleteUser.success).toBeTruthy();

    // Should return information of authorized user
    const {
      data: { me },
    } = await query<any>(gql`
      query {
        me {
          id
          name
        }
      }
    `);
    expect(me.id).toEqual(user.id);
    expect(me.name).toEqual(user.name);

    // Should return paginated users
    const {
      data: {
        getAllUsers: { totalDocs },
      },
    } = await query<any>(gql`
      {
        getAllUsers(input: { limit: 100, page: 1, sortBy: createdAt, sortDir: desc }) {
          totalDocs
        }
      }
    `);
    expect(totalDocs).toBeDefined();
  });

  it('Should update user profile', async () => {
    const { mutate, authUser } = await authenticatedTestClient();

    const { data } = await mutate<any>(
      gql`
        mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
          updateMyProfile(input: $input) {
            success
            message
            user {
              id
              itemId
              name
              email
              shortName
              fullName
              phone
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: authUser?.id,
            email: alex.email,
            name: alex.name,
            phone: alex.phone,
          },
        },
      },
    );

    const { updateMyProfile } = data;
    expect(updateMyProfile.success).toBeTruthy();
    expect(updateMyProfile.user.id).toEqual(authUser?.id);
    expect(updateMyProfile.user.email).toEqual(alex.email);
    expect(updateMyProfile.user.name).toEqual(alex.name);
    expect(updateMyProfile.user.phone).toEqual(alex.phone);
  });

  it('Should update user password', async () => {
    const { mutate, authUser } = await authenticatedTestClient();
    const newPassword = 'newPassword';

    const { data } = await mutate<any>(
      gql`
        mutation UpdateMyPassword($input: UpdateMyPasswordInput!) {
          updateMyPassword(input: $input) {
            success
            message
          }
        }
      `,
      {
        variables: {
          input: {
            id: authUser?.id,
            oldPassword: ADMIN_PASSWORD,
            newPassword,
            newPasswordB: newPassword,
          },
        },
      },
    );

    const { updateMyPassword } = data;
    expect(updateMyPassword.success).toBeTruthy();
  });
});
