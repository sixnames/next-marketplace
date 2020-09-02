import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ROLE_SLUG_GUEST } from '../../../config';
import { max, alex } from '../__fixtures__';
import { RoleModel } from '../../../entities/Role';
import { UserModel } from '../../../entities/User';
import { gql } from 'apollo-server-express';

const { email, password, phone, name } = max;

describe('User', () => {
  it('Should CRUD user', async () => {
    const user = await UserModel.findOne({
      email: ADMIN_EMAIL,
    });
    if (!user) {
      throw Error('Test user not found');
    }

    const { mutate, query } = await testClientWithContext();

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

    // User shouldn't signIn if user not found
    const {
      data: {
        signIn: { success: signInNotFoundSuccess },
      },
    } = await mutate<any>(gql`
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

    expect(signInNotFoundSuccess).toBeFalsy();

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

    // User should sign in
    const {
      data: {
        signIn: { success, user: mutationUser },
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
              email
              shortName
              fullName
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

    expect(success).toBeTruthy();
    expect(mutationUser.id).toEqual(user.id);

    const role = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    if (!role) {
      throw Error('guest role not found');
    }
    // Should create new user
    const {
      data: { createUser },
    } = await mutate<any>(gql`
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
    expect(success).toBeTruthy();
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
    expect(totalDocs).toEqual(2);

    // User should sign out
    const {
      data: { signOut },
    } = await mutate<any>(gql`
      mutation {
        signOut {
          success
          message
        }
      }
    `);
    expect(signOut.success).toBeTruthy();
  });
});
