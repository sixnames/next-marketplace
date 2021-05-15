describe('Site configs', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/cms/config`);
  });

  it('Should update configs', () => {
    cy.visit('/');

    // Should update asset configs
    // cy.getByCy('site-configs').should('exist');
    // cy.getByCy(`${siteLogoSlug}-remove`).click();
    // cy.getByCy(siteLogoSlug).attachFile('test-logo.svg', { subjectType: 'drag-n-drop' });
    // cy.getByCy(`${siteLogoSlug}-image`).should('exist');

    // cy.getByCy(`${pageDefaultPreviewImageSlug}-remove`).click();
    // cy.getByCy(pageDefaultPreviewImageSlug).attachFile('test-image.jpg', {
    //   subjectType: 'drag-n-drop',
    // });
    // cy.getByCy(`${pageDefaultPreviewImageSlug}-image`).should('exist');

    // Should update not asset configs
    // cy.getByCy('site-configs').should('exist');

    // pageDefaultTitle config
    // cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-${DEFAULT_LOCALE}-0`)
    //   .clear()
    //   .type(newSiteDefaultTitle);
    // cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-accordion-${SECONDARY_LOCALE}`).click();
    // cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-${SECONDARY_LOCALE}-0`)
    //   .clear()
    //   .type(newSiteDefaultTitle);

    // cy.getByCy(pageDefaultTitleSecondaryCityTestId).click();
    // cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-${DEFAULT_LOCALE}-0`)
    //   .clear()
    //   .type(newSiteDefaultTitle);
    // cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-accordion-${SECONDARY_LOCALE}`).click();
    // cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-${SECONDARY_LOCALE}-0`)
    //   .clear()
    //   .type(newSiteDefaultTitle);
    // cy.getByCy(`${pageDefaultTitleConfigSlug}-submit`).click();
    // cy.shouldNotError();

    // email config with multiple values
    // cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LOCALE}-0`).clear().type(newEmail);
    // cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LOCALE}-0-add`).click();
    // cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LOCALE}-1`).clear().type(newEmail);
    // cy.getByCy(`${emailConfigSlug}-submit`).click();
    // cy.shouldNotError();

    // remove second email
    // cy.getByCy(`${emailDefaultCityTestId}-${DEFAULT_LOCALE}-1-remove`).click();
    // cy.getByCy('confirm').click();
    // cy.getByCy(`${emailConfigSlug}-submit`).click();
    // cy.shouldNotError();
  });
});
