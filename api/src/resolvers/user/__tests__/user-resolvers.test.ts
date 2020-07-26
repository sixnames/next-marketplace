import { getTestClientWithUser } from '../../../utils/testUtils/testHelpers';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ROLE_CUSTOMER } from '../../../config';
import { max, alex } from '../__fixtures__';

const { email, password, phone, name } = max;

describe('User', () => {
  it('Should CRUD user', async () => {
    const { mutate, query, user } = await getTestClientWithUser({});
    if (!user) {
      throw Error('Test user not found');
    }

    // User should sign up
    const {
      data: { signUp },
    } = await mutate(`
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
    } = await mutate(`
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
    const {
      data: {
        signIn: { success: signInEmailFakeSuccess },
      },
    } = await mutate(`
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
    expect(signInEmailFakeSuccess).toBeDefined();

    // User shouldn't signIn if is wrong Password
    const {
      data: {
        signIn: { success: signInPasswordFakeSuccess },
      },
    } = await mutate(`
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
    expect(signInPasswordFakeSuccess).toBeFalsy();

    // User should sign in
    const {
      data: {
        signIn: { success, user: mutationUser },
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
              email
              shortName
              fullName
            }
          }
        }`,
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

    // Should create new user
    const {
      data: { createUser },
    } = await mutate(`
          mutation {
            createUser(
              input: {
                email: "${alex.email}",
                name: "${alex.name}",
                phone: "${alex.phone}",
                role: "${ROLE_CUSTOMER}",
              }
            ) {
             success
             message
             user {
               id
               email
               phone
               role
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
    } = await mutate(`
          mutation {
            updateUser(
              input: {
                id: "${createdUser.id}",
                email: "${alex.email}",
                name: "${alex.name}",
                phone: "${createdUser.phone}",
                role: "${createdUser.role}",
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
    } = await query(`
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
    } = await mutate(`
          mutation {
            deleteUser(id: "${updatedUser.id}") { success }
          }
        `);
    expect(deleteUser.success).toBeTruthy();

    // Should return information of authorized user
    const {
      data: { me },
    } = await query(`
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
    } = await query(`
        {
          getAllUsers(input: {
            limit: 100,
            page: 1,
            sortBy: createdAt
            sortDir: desc
          }) {
            totalDocs
          }
        }
        `);
    expect(totalDocs).toEqual(2);

    // User should sign out
    const {
      data: { signOut },
    } = await mutate(`
        mutation {
          signOut {
            success
            message
          }
        }`);
    expect(signOut.success).toBeTruthy();
  });
});
