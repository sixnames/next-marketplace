import { DEFAULT_CITY, DEFAULT_LOCALE, SECONDARY_CITY, SECONDARY_LOCALE } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Site configs', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`/cms/config`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should update configs', () => {
    const siteLogoSlug = mockData.configSiteLogo.slug;
    const pageDefaultPreviewImageSlug = mockData.configPageDefaultPreviewImage.slug;

    const pageDefaultTitleConfigSlug = mockData.configPageDefaultTitle.slug;
    const pageDefaultTitleDefaultCityTestId = `${pageDefaultTitleConfigSlug}-${DEFAULT_CITY}`;
    const pageDefaultTitleSecondaryCityTestId = `${pageDefaultTitleConfigSlug}-${SECONDARY_CITY}`;

    const emailConfigSlug = mockData.configContactEmail.slug;
    const emailDefaultCityTestId = `${emailConfigSlug}-${DEFAULT_CITY}`;

    const newEmail = 'new-email@email.com';
    const newSiteDefaultTitle = 'new default title';

    // Should update asset configs
    cy.getByCy('site-configs').should('exist');
    cy.getByCy(`${siteLogoSlug}-remove`).click();
    cy.getByCy(siteLogoSlug).attachFile('test-logo.svg', { subjectType: 'drag-n-drop' });
    cy.getByCy(`${siteLogoSlug}-image`).should('exist');

    cy.getByCy(`${pageDefaultPreviewImageSlug}-remove`).click();
    cy.getByCy(pageDefaultPreviewImageSlug).attachFile('test-image.jpg', {
      subjectType: 'drag-n-drop',
    });
    cy.getByCy(`${pageDefaultPreviewImageSlug}-image`).should('exist');

    // Should update not asset configs
    cy.getByCy('site-configs').should('exist');

    // pageDefaultTitle config
    cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-${DEFAULT_LOCALE}-0`)
      .clear()
      .type(newSiteDefaultTitle);
    cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-${SECONDARY_LOCALE}-0`)
      .clear()
      .type(newSiteDefaultTitle);

    cy.getByCy(pageDefaultTitleSecondaryCityTestId).click();
    cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-${DEFAULT_LOCALE}-0`)
      .clear()
      .type(newSiteDefaultTitle);
    cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-accordion-${SECONDARY_LOCALE}`).click();
    cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-${SECONDARY_LOCALE}-0`)
      .clear()
      .type(newSiteDefaultTitle);
    cy.getByCy(`${pageDefaultTitleConfigSlug}-submit`).click();
    cy.shouldNotError();

    // email config with multiple values
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LOCALE}-0`).clear().type(newEmail);
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LOCALE}-0-add`).click();
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LOCALE}-1`).clear().type(newEmail);
    cy.getByCy(`${emailConfigSlug}-submit`).click();
    cy.shouldNotError();

    // remove second email
    cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LOCALE}-1-remove`).click();
    cy.getByCy('confirm').click();
    cy.getByCy(`${emailConfigSlug}-submit`).click();
    cy.shouldNotError();
  });
});
