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

Cypress.Commands.add('createTestData', (callback?: (mocks: any) => void) => {
  const createTestDataURI = `${apiHost}/create-test-data`;
  cy.request('GET', createTestDataURI).then((res) => {
    if (callback) {
      callback(res.body);
    }
  });
});

Cypress.Commands.add('clearTestData', () => {
  const clearTestDataURI = `${apiHost}/clear-test-data`;
  cy.request('GET', clearTestDataURI);
});

Cypress.Commands.add(
  'testAuth',
  (redirect = '/', email = 'admin@gmail.com', password = 'admin') => {
    const testAuthURI = `${apiHost}/test-sign-in`;
    cy.request({
      method: 'GET',
      url: testAuthURI,
      qs: {
        email,
        password,
      },
    }).then(() => {
      cy.visit(redirect);
    });
  },
);
