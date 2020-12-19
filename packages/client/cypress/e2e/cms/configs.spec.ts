/// <reference types="cypress" />
import { SITE_CONFIGS_INITIAL } from '@yagu/mocks';
import { DEFAULT_CITY, DEFAULT_LANG, SECONDARY_LANG, SECONDARY_CITY } from '@yagu/config';

const newEmail = 'new-email@email.com';
const newSiteDefaultTitle = 'new default title';

describe('Site configs', () => {
  beforeEach(() => {
    cy.createTestData();
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
    // pageDefaultTitle config
    const pageDefaultTitleConfig = SITE_CONFIGS_INITIAL.find(
      ({ slug }: any) => slug === 'pageDefaultTitle',
    );

    if (!pageDefaultTitleConfig) {
      throw Error('pageDefaultTitleConfig not found');
    }

    const pageDefaultTitleDefaultCityTestId = `${pageDefaultTitleConfig.slug}-${DEFAULT_CITY}`;
    const pageDefaultTitleSecondaryCityTestId = `${pageDefaultTitleConfig.slug}-${SECONDARY_CITY}`;

    cy.getByCy('site-configs').should('exist');
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
    cy.getByCy(`${pageDefaultTitleConfig.slug}-submit`).click();
    cy.shouldNotError();

    // email config with multiple values
    const emailConfig = SITE_CONFIGS_INITIAL.find(({ slug }: any) => slug === 'contactEmail');

    if (!emailConfig) {
      throw Error('emailConfig not found');
    }

    const emailDefaultCityTestId = `${emailConfig.slug}-${DEFAULT_CITY}`;
    cy.getByCy(emailDefaultCityTestId).click();
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LANG}-0`).clear().type(newEmail);
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LANG}-0-add`).click();
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LANG}-1`).clear().type(newEmail);
    cy.getByCy(`${emailConfig.slug}-submit`).click();
    cy.shouldNotError();

    // remove second email
    cy.getByCy(emailDefaultCityTestId).click();
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LANG}-1-remove`).click();
    cy.getByCy('confirm').click();
    cy.getByCy(`${emailConfig.slug}-submit`).click();
    cy.shouldNotError();
  });
});
