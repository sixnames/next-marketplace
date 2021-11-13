import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG } from 'config/common';

const profileUrl = `/${DEFAULT_COMPANY_SLUG}/${DEFAULT_CITY}/profile/details`;

describe('Profile details', () => {
  beforeEach(() => {
    cy.testAuth(profileUrl);
  });

  it('Should update profile', () => {
    const newName = 'newName';
    const newLastName = 'newLastName';
    const newSecondName = 'newSecondName';
    const newEmail = 'newEmail@gmail.com';
    const newPhone = '39998883322';
    const maskedNewPhone = '3 999 888-33-22';
    cy.getByCy('profile-details').should('exist');

    // Should update
    cy.getByCy('name').clear().type(newName);
    cy.getByCy('lastName').clear().type(newLastName);
    cy.getByCy('secondName').clear().type(newSecondName);
    cy.getByCy('email').clear().type(newEmail);
    cy.getByCy('phone').clear().type(newPhone);
    cy.getByCy('submit-my-profile').click();
    cy.getByCy('update-profile-modal').should('exist');
    cy.getByCy('confirm').click();

    // Should redirect to sign in page
    cy.wait(1500);
    cy.getByCy(`sign-in-email`).clear().type(newEmail);
    cy.getByCy(`sign-in-password`).clear().type('password');
    cy.getByCy(`sign-in-submit`).click();
    cy.getByCy(`main-page`).should('exist');

    // Profile should be updated
    cy.visit(profileUrl);
    cy.getByCy('name').should('have.value', newName);
    cy.getByCy('lastName').should('have.value', newLastName);
    cy.getByCy('secondName').should('have.value', newSecondName);
    cy.getByCy('email').should('have.value', newEmail);
    cy.getByCy('phone').should('have.value', maskedNewPhone);

    // Should validate
    const newPassword = 'newPassword';
    cy.getByCy('update-my-password').click();
    cy.getByCy('password-modal').should('exist');
    cy.getByCy('oldPassword').type('password');
    cy.getByCy('newPassword').type(newPassword);
    cy.getByCy('newPasswordB').clear().type(newPassword);
    cy.getByCy('password-submit').click();

    // Should sign in with new password
    cy.wait(1500);
    cy.getByCy(`sign-in-email`).clear().type(newEmail);
    cy.getByCy(`sign-in-password`).clear().type(newPassword);
    cy.getByCy(`sign-in-submit`).click();
    cy.getByCy(`main-page`).should('exist');
  });
});
