import 'cypress-file-upload';
import 'cypress-localstorage-commands';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';

// noinspection ES6PreferShortImport
import { ROUTE_CATALOGUE } from '../../config/common';

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
  return cy.get(`[data-cy="${testId}"]`) as any;
});

Cypress.Commands.add('visitBlank', (testId, additionalPath?: string) => {
  cy.getByCy(testId)
    .first()
    .then((el: any) => {
      const url = el.data('url');
      cy.visit(`${url}${additionalPath ? `/${additionalPath}` : ''}`);
    });
});

Cypress.Commands.add('visitLinkHref', (testId) => {
  cy.get(`[data-cy="${testId}"]`).invoke('removeAttr', 'target').click();
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
  return cy.get(selector) as any;
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
  cy.log('Seeding test data');
  cy.exec(`yarn seed-test-db`).then((result) => {
    const error = result.stderr || '';
    expect(error).includes('DeprecationWarning');
    cy.log('Test data success');
  });
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
  const catalogueRoute = `${ROUTE_CATALOGUE}/${fixtureIds.rubricWineSlug}`;
  cy.visit(catalogueRoute);

  // add product #1
  cy.visitLinkHref('catalogue-item-0-name-grid');
  cy.getByCy(`card`).should('exist');
  cy.getByCy(`card-shops-${fixtureIds.shopASlug}-add-to-cart`).click();

  // add product #2
  cy.getByCy(`cart-modal-close`).click();
  cy.getByCy(`card-shops-${fixtureIds.shopBSlug}-add-to-cart`).click();
  cy.getByCy(`cart-modal-continue`).click();

  // should navigate to cart
  cy.wait(1500);
  cy.getByCy(`cart`).should('exist');

  // should fill all order fields
  if (orderFields) {
    cy.getByCy(`order-form-name`).clear().type(orderFields.customerName);
    cy.getByCy(`order-form-phone`).clear().type(orderFields.customerPhone);
    cy.getByCy(`order-form-email`).clear().type(orderFields.customerEmail);
  }
  // should choose reservation date
  // cy.clock(1624449303350);
  // cy.get('#reservationDate').click();
  // cy.get('.react-datepicker__day--024').click();
  cy.getByCy(`order-form-comment`).type('comment');
  cy.getByCy(`order-form-privacy-checkbox`).check();

  // should make an order and redirect to the thank-you page
  cy.getByCy(`cart-aside-confirm`).click();
  cy.wait(1500);

  cy.get(`[data-cy="thank-you"]`).then(() => {
    if (callback) {
      callback();
    }
  });
});
