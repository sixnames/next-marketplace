import 'cypress-file-upload';
import 'cypress-localstorage-commands';

// noinspection ES6PreferShortImport
import { CATALOGUE_DEFAULT_RUBRIC_SLUG, ROUTE_CATALOGUE } from '../../config/common';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getByCy', (testId) => {
  cy.wait(600);
  cy.get(`[data-cy="${testId}"]`);
});

Cypress.Commands.add('shouldSuccess', (log?: string) => {
  if (log) {
    cy.log(log);
  }
  cy.getByCy(`success-notification`);
  cy.getByCy(`close-notification`).click();
});

Cypress.Commands.add('shouldError', (log?: string) => {
  if (log) {
    cy.log(log);
  }
  cy.getByCy(`error-notification`);
  cy.getByCy(`close-notification`).click();
});

Cypress.Commands.add('shouldNotError', () => {
  cy.getByCy(`error-notification`).should('not.exist');
});

Cypress.Commands.add('getBySelector', (selector) => {
  cy.wait(300);
  cy.get(selector);
});

Cypress.Commands.add('selectNthOption', (select, nth) => {
  cy.getBySelector(`${select} option:nth-child(${nth})`).as('option');
  cy.get('@option').then((option) => {
    cy.get(select).invoke('val', option.val()).trigger('change');
  });
});

Cypress.Commands.add('selectOptionByTestId', (select, testId) => {
  cy.getBySelector(`select[data-cy="${select}"] option[data-cy="option-${testId}"]`).as('option');
  cy.get('@option').then((option) => {
    cy.get(`select[data-cy="${select}"]`).invoke('val', option.val()).trigger('change');
  });
});

Cypress.Commands.add('closeNotification', () => {
  cy.getByCy('close-notification').as('close');
  cy.get('@close').then((close) => {
    close.each(function (_index, item) {
      if (item) {
        item.click();
      }
    });
  });
});

Cypress.Commands.add('createTestData', () => {
  cy.exec(`yarn seed-test-db`);
});

Cypress.Commands.add(
  'testAuth',
  (redirect = '/', email = 'admin@gmail.com', password = 'password') => {
    cy.request({
      method: 'GET',
      url: `/api/auth/csrf`,
    }).then((res) => {
      const csrfToken = res.body.csrfToken;

      cy.request({
        method: 'POST',
        url: `/api/auth/callback/credentials`,
        body: {
          email: email,
          password,
          csrfToken,
        },
      }).then(() => {
        cy.visit(redirect);
      });
    });
  },
);

Cypress.Commands.add('signOut', (redirect = '/') => {
  cy.visit('/api/auth/signout');
  cy.get('[type="submit"]').click();
  cy.visit(redirect);
});

Cypress.Commands.add('makeAnOrder', ({ callback, orderFields }: Cypress.MakeAnOrderInterface) => {
  const catalogueRoute = `${ROUTE_CATALOGUE}/${CATALOGUE_DEFAULT_RUBRIC_SLUG}`;
  cy.visit(catalogueRoute);

  // Should navigate to cart
  cy.get(`[data-cy=catalogue-item-0-name-grid]`).invoke('removeAttr', 'target').click();

  // Add product #1
  cy.getByCy(`card`).should('exist');
  cy.getByCy(`card-shops-1-0-add-to-cart`).click();

  // Add product #2
  cy.getByCy(`cart-modal-close`).click();
  cy.getByCy(`card-shops-1-1-add-to-cart`).click();
  cy.getByCy(`cart-modal-continue`).click();

  // Should navigate to cart
  cy.wait(1500);
  cy.getByCy(`cart-aside-confirm`).click();

  // Should navigate to order form
  cy.wait(1500);
  cy.getByCy(`order-form`).should('exist');

  // Should fill all order fields
  if (orderFields) {
    cy.getByCy(`order-form-name`).clear().type(orderFields.customerName);
    cy.getByCy(`order-form-phone`).clear().type(orderFields.customerPhone);
    cy.getByCy(`order-form-email`).clear().type(orderFields.customerEmail);
  }
  // Should choose reservation date
  // cy.clock(1624449303350);
  // cy.get('#reservationDate').click();
  // cy.get('.react-datepicker__day--024').click();
  cy.getByCy(`order-form-comment`).type('comment');

  // Should make an order and redirect to the Thank you page
  cy.getByCy(`cart-aside-confirm`).click();
  cy.wait(1500);

  cy.get(`[data-cy="thank-you"]`).then(() => {
    if (callback) {
      callback();
    }
  });
});
