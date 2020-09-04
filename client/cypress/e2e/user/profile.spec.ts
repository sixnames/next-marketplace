/// <reference types="cypress" />

describe('Profile', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/profile`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should update profile', () => {
    const newName = 'newName';
    const newLastName = 'newLastName';
    const newSecondName = 'newSecondName';
    const newEmail = 'newEmail@gmail.com';
    const newPhone = '39998883322';

    // Should validate
    cy.getByCy('name').clear();
    cy.getByCy('lastName').clear();
    cy.getByCy('email').clear();
    cy.getByCy('phone').clear();
    cy.getByCy('submit-my-profile').click();
    cy.getByCy('name-error').should('exist');
    cy.getByCy('email-error').should('exist');
    cy.getByCy('phone-error').should('exist');

    // Should update
    cy.getByCy('name').type(newName);
    cy.getByCy('lastName').type(newLastName);
    cy.getByCy('secondName').type(newSecondName);
    cy.getByCy('email').type(newEmail);
    cy.getByCy('phone').type(newPhone);
    cy.getByCy('submit-my-profile').click();
    cy.getByCy('app-nav-user-name').should('contain', `${newName.charAt(0)}.${newLastName}`);
  });

  it('Should user password', () => {
    cy.getMockData(({ ADMIN_PASSWORD }) => {
      const newPassword = 'newPassword';
      const newPasswordWrong = 'newPasswordWrong';

      // Should validate
      cy.getByCy('update-my-password').click();
      cy.getByCy('password-modal').should('exist');
      cy.getByCy('password-submit').click();
      cy.getByCy('oldPassword-error').should('exist');
      cy.getByCy('newPassword-error').should('exist');
      cy.getByCy('newPasswordB-error').should('exist');

      cy.getByCy('oldPassword').type(ADMIN_PASSWORD);
      cy.getByCy('newPassword').type(newPassword);
      cy.getByCy('newPasswordB').type(newPasswordWrong);
      cy.getByCy('password-submit').click();
      cy.getByCy('newPasswordB-error').should('exist');

      // Should update
      cy.getByCy('newPasswordB').clear().type(newPassword);
      cy.getByCy('password-submit').click();
      cy.getByCy('success-notification').should('exist');
      cy.getByCy('password-modal').should('not.exist');
    });
  });
});
