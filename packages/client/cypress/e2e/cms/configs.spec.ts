/// <reference types="cypress" />
import { DEFAULT_CITY, DEFAULT_LANG, SECONDARY_CITY, SECONDARY_LANG } from '@yagu/shared';

describe('Site configs', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/app/cms/config`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should update asset configs', () => {
    cy.getByCy('site-configs').should('exist');
    cy.getByCy('siteLogo-remove').click();
    cy.getByCy('siteLogo').attachFile('test-logo.svg', { subjectType: 'drag-n-drop' });
    cy.getByCy('siteLogo-image').should('exist');

    cy.getByCy('pageDefaultPreviewImage-remove').click();
    cy.getByCy('pageDefaultPreviewImage').attachFile('test-image.jpg', {
      subjectType: 'drag-n-drop',
    });
    cy.getByCy('pageDefaultPreviewImage-image').should('exist');
  });

  it('Should update not asset configs', () => {
    const newEmail = 'new-email@email.com';
    const newSiteDefaultTitle = 'new default title';

    cy.getByCy('site-configs').should('exist');

    // pageDefaultTitle config
    const pageDefaultTitleConfigSlug = mockData.configPageDefaultTitle?.slug;
    if (!pageDefaultTitleConfigSlug) {
      throw Error('pageDefaultTitleConfig not found');
    }

    const pageDefaultTitleDefaultCityTestId = `${pageDefaultTitleConfigSlug}-${DEFAULT_CITY}`;
    const pageDefaultTitleSecondaryCityTestId = `${pageDefaultTitleConfigSlug}-${SECONDARY_CITY}`;
    cy.getByCy(pageDefaultTitleDefaultCityTestId).click();
    cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-${DEFAULT_LANG}-0`)
      .clear()
      .type(newSiteDefaultTitle);
    cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-${SECONDARY_LANG}-0`)
      .clear()
      .type(newSiteDefaultTitle);

    cy.getByCy(pageDefaultTitleSecondaryCityTestId).click();
    cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-${DEFAULT_LANG}-0`)
      .clear()
      .type(newSiteDefaultTitle);
    cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-accordion-${SECONDARY_LANG}`).click();
    cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-${SECONDARY_LANG}-0`)
      .clear()
      .type(newSiteDefaultTitle);
    cy.getByCy(`${pageDefaultTitleConfigSlug}-submit`).click();
    cy.shouldNotError();

    // email config with multiple values
    const emailConfigSlug = mockData.configContactEmail?.slug;

    if (!emailConfigSlug) {
      throw Error('emailConfig not found');
    }

    const emailDefaultCityTestId = `${emailConfigSlug}-${DEFAULT_CITY}`;
    cy.getByCy(emailDefaultCityTestId).click();
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LANG}-0`).clear().type(newEmail);
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LANG}-0-add`).click();
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LANG}-1`).clear().type(newEmail);
    cy.getByCy(`${emailConfigSlug}-submit`).click();
    cy.shouldNotError();

    // remove second email
    cy.getByCy(emailDefaultCityTestId).click();
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LANG}-1-remove`).click();
    cy.getByCy('confirm').click();
    cy.getByCy(`${emailConfigSlug}-submit`).click();
    cy.shouldNotError();
  });
});
