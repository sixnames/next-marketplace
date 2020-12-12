import 'cypress-file-upload';
import { DEFAULT_LANG, LANG_NOT_FOUND_FIELD_MESSAGE, SECONDARY_LANG } from '@yagu/config';
import GetByTranslationFieldCyInterface = Cypress.GetByTranslationFieldCyInterface;
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
  cy.wait(300);
  cy.get(`[data-cy="${testId}"]`);
});

Cypress.Commands.add(
  'getByTranslationFieldCy',
  ({
    languages = [],
    chosenLanguage = DEFAULT_LANG,
    cyPrefix = '',
  }: GetByTranslationFieldCyInterface) => {
    let value: string;
    const currentLang = (languages || []).find(({ key }) => key === chosenLanguage);
    const defaultLang = (languages || []).find(({ key }) => key === DEFAULT_LANG);
    const defaultLangValue = defaultLang ? defaultLang.value : LANG_NOT_FOUND_FIELD_MESSAGE;

    if (!currentLang && chosenLanguage !== DEFAULT_LANG) {
      const universalLang = (languages || []).find(({ key }) => key === SECONDARY_LANG);

      if (!universalLang) {
        value = defaultLangValue;
        cy.getByCy(`${cyPrefix}-${value}`);
        return;
      }

      value = universalLang ? universalLang.value : LANG_NOT_FOUND_FIELD_MESSAGE;
      cy.getByCy(`${cyPrefix}-${value}`);
      return;
    }

    if (!currentLang) {
      value = defaultLangValue;
      cy.getByCy(`${cyPrefix}-${value}`);
      return;
    }

    value = currentLang ? currentLang.value : LANG_NOT_FOUND_FIELD_MESSAGE;
    cy.getByCy(`${cyPrefix}-${value}`);
  },
);

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

Cypress.Commands.add('openMoreNav', () => {
  cy.getByCy('more-nav-trigger').click();
});

Cypress.Commands.add('closeMoreNav', () => {
  cy.getByCy('more-nav-close').click({ force: true });
});

Cypress.Commands.add('visitMoreNavLink', (testId) => {
  cy.getByCy('more-nav-trigger').click();
  cy.getByCy(`more-nav-item-${testId}`).click();
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

const apiHost = 'http://localhost:4000';

Cypress.Commands.add('clearTestData', () => {
  const clearTestDataURI = `${apiHost}/clear-test-data`;
  cy.request('GET', clearTestDataURI);
});

Cypress.Commands.add('createTestData', (callback?: (mocks: any) => void) => {
  const createTestDataURI = `${apiHost}/create-test-data`;
  cy.request('GET', createTestDataURI).then((res) => {
    if (callback) {
      callback(res.body);
    }
  });
});

Cypress.Commands.add(
  'testAuth',
  (redirect = '/', email = 'admin@gmail.com', password = 'admin') => {
    const mutation = `
   mutation {
     signIn(input: { email: "${email}" password: "${password}"}) {
      success
      message
    }
   }`;

    cy.request({
      url: `${apiHost}/graphql`,
      method: 'POST',
      body: { query: mutation },
    }).then(({ body }) => {
      if (!body.data.signIn.success) {
        throw Error('Test authentication error');
      }
      cy.visit(redirect);
    });
  },
);

Cypress.Commands.add(
  'makeAnOrder',
  ({ callback, orderFields, mockData }: Cypress.MakeAnOrderInterface) => {
    cy.getByTranslationFieldCy({
      cyPrefix: 'main-rubric',
      languages: mockData.rubricLevelOneA.name,
    }).click();
    // Should navigate to cart
    cy.getByCy(`catalogue-item-${mockData.productA.slug}`).click();

    // Add product #1
    cy.getByCy(`card-${mockData.productA.slug}`).should('exist');
    cy.getByCy(`card-tabs-shops`).click();
    cy.getByCy(`card-shops`).should('exist');
    cy.getByCy(`card-shops-list`).should('exist');
    cy.getByCy(`card-shops-${mockData.shopA.slug}-add-to-cart`).click();

    // Add second product #2
    cy.getByCy(`cart-modal-close`).click();
    cy.getByTranslationFieldCy({
      cyPrefix: 'main-rubric',
      languages: mockData.rubricLevelOneA.name,
    }).click();
    cy.getByCy('catalogue').should('exist');
    cy.getByCy(`catalogue-item-${mockData.connectionProductA.slug}`).click();
    cy.getByCy(`card-${mockData.connectionProductA.slug}`).should('exist');
    cy.getByCy(`card-tabs-shops`).click();
    cy.getByCy(`card-shops-${mockData.shopB.slug}-add-to-cart`).click();
    cy.getByCy(`cart-modal-continue`).click();

    // Should navigate to cart
    cy.getByCy(`cart-aside-confirm`).click();

    // Should navigate to order form
    cy.getByCy(`order-form`).should('exist');

    // Should fill all order fields
    if (orderFields) {
      cy.getByCy(`order-form-name`).clear().type(orderFields.customerName);
      cy.getByCy(`order-form-phone`).clear().type(orderFields.customerPhone);
      cy.getByCy(`order-form-email`).clear().type(orderFields.customerEmail);
    }
    cy.getByCy(`order-form-comment`).type('comment');

    // Should make an order and redirect to the Thank you page
    cy.getByCy(`cart-aside-confirm`).click();
    cy.get(`[data-cy="thank-you"]`).then((e) => {
      // Get created order itemId
      const orderItemId = e.attr('data-order-item-id');

      if (callback) {
        callback(orderItemId);
      }
    });
  },
);
