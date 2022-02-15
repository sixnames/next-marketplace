import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Users', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.users.url);
  });

  it('Should CRUD users', () => {
    const newUserName = 'newUserName';
    const newUserEmail = 'newUserEmail@mail.com';
    const newUserPhone = '71234567890';
    const updatedUserName = 'updatedUserName';
    const newPassword = 'newPassword';

    // Should create user
    cy.getByCy('users-list').should('exist');
    cy.getByCy('create-user').click();
    cy.getByCy('create-user-modal').should('exist');
    cy.getByCy('name').clear().type(newUserName);
    cy.getByCy('lastName').type(newUserName);
    cy.getByCy('secondName').type(newUserName);
    cy.getByCy('email').type(newUserEmail);
    cy.getByCy('phone').type(newUserPhone);
    cy.selectOptionByTestId('role', 'Гость');
    cy.getByCy('submit-user').click();
    cy.wait(1500);
    cy.getByCy(`${newUserName}-row`).should('exist');

    // Should display user details
    cy.getByCy('users-search-input').type(newUserName);
    cy.getByCy('users-search-submit').click();
    cy.getByCy(`${newUserName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`user-details-page`).should('exist');
    cy.getByCy('name').clear().clear().type(updatedUserName);
    cy.getByCy('lastName').clear().type(updatedUserName);
    cy.getByCy('secondName').clear().type(updatedUserName);
    cy.getByCy('submit-user').click();
    cy.wait(1500);
    cy.getByCy('user-orders').click();
    cy.wait(1500);
    cy.getByCy(`user-orders-page`).should('exist');
    cy.getByCy('user-assets').click();
    cy.wait(1500);
    cy.getByCy(`user-assets-page`).should('exist');

    // Should update user password
    cy.getByCy('user-password').click();
    cy.wait(1500);
    cy.getByCy(`user-password-page`).should('exist');
    cy.getByCy('newPassword').type(newPassword);
    cy.getByCy('repeatPassword').type('f');
    cy.getByCy('submit-password').click();
    cy.shouldError();
    cy.getByCy('repeatPassword').clear().type(newPassword);
    cy.getByCy('submit-password').click();
    cy.wait(1500);

    // Should CRUD user categories
    cy.getByCy('user-categories').click();
    cy.wait(1500);
    cy.getByCy(`user-categories-page`).should('exist');
    cy.getByCy('add-user-category').click();
    cy.getByCy(`set-user-category-modal`).should('exist');
    cy.selectOptionByTestId(`companyId`, 'Company A');
    cy.selectOptionByTestId(`categoryId`, 'Company A category 1');
    cy.getByCy('submit-user-category').click();
    cy.wait(1500);
    cy.getByCy(`Company A category 1-delete`).click();
    cy.getByCy(`unset-user-category-modal`).should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`Company A category 1-delete`).should('not.exist');

    // Should delete user
    cy.getByCy('app-nav-item-cms-users').click();
    cy.getByCy(`${updatedUserName}-delete`).click();
    cy.getByCy('delete-user-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedUserName}-delete`).should('not.exist');
  });
});
