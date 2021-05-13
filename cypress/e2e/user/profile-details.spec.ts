import { ADULT_KEY, ADULT_TRUE } from 'config/common';

export {};

describe('Profile details', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`/profile/details`);
  });

  it('Should update profile', () => {
    const newName = 'newName';
    const newLastName = 'newLastName';
    const newSecondName = 'newSecondName';
    const newEmail = 'newEmail@gmail.com';
    const newPhone = '39998883322';
    const maskedNewPhone = '3 999 888-33-22';
    cy.getByCy('profile-details').should('exist');

    // Should validate
    cy.getByCy('name').clear();
    cy.getByCy('lastName').clear();
    cy.getByCy('secondName').clear();
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
    cy.getByCy('update-profile-modal').should('exist');
    cy.getByCy('confirm').click();

    // Should redirect to sign in page
    cy.getByCy(`sign-in-email`).clear().type(newEmail);
    cy.getByCy(`sign-in-password`).clear().type('password');
    cy.getByCy(`sign-in-submit`).click();
    cy.getByCy(`main-page`).should('exist');

    // Profile should be updated
    cy.visit(`/profile/details`);
    cy.getByCy('name').should('have.value', newName);
    cy.getByCy('lastName').should('have.value', newLastName);
    cy.getByCy('secondName').should('have.value', newSecondName);
    cy.getByCy('email').should('have.value', newEmail);
    cy.getByCy('phone').should('have.value', maskedNewPhone);

    // Should validate
    const newPassword = 'newPassword';
    const newPasswordWrong = 'newPasswordWrong';
    cy.getByCy('update-my-password').click();
    cy.getByCy('password-modal').should('exist');
    cy.getByCy('password-submit').click();
    cy.getByCy('oldPassword-error').should('exist');
    cy.getByCy('newPassword-error').should('exist');
    cy.getByCy('newPasswordB-error').should('exist');

    cy.getByCy('oldPassword').type('password');
    cy.getByCy('newPassword').type(newPassword);
    cy.getByCy('newPasswordB').type(newPasswordWrong);
    cy.getByCy('password-submit').click();
    cy.getByCy('newPasswordB-error').should('exist');

    // Should update
    cy.getByCy('newPasswordB').clear().type(newPassword);
    cy.getByCy('password-submit').click();

    // Should sign in with new password
    cy.getByCy(`sign-in-email`).clear().type(newEmail);
    cy.getByCy(`sign-in-password`).clear().type(newPassword);
    cy.getByCy(`sign-in-submit`).click();
    cy.getByCy(`main-page`).should('exist');
  });
});
