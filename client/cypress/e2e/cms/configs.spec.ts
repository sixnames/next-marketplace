// const newSiteName = 'new site name';
// const newSitePhone = '+89990007766';
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
    cy.getMockData(() => {
      cy.getByCy('siteLogo-remove').click();
      cy.getByCy('siteLogo').attachFile('test-logo.svg', { subjectType: 'drag-n-drop' });
      cy.getByCy('siteLogo-image').should('exist');

      cy.getByCy('pageDefaultPreviewImage-remove').click();
      cy.getByCy('pageDefaultPreviewImage').attachFile('test-image.jpg', {
        subjectType: 'drag-n-drop',
      });
      cy.getByCy('pageDefaultPreviewImage-image').should('exist');
    });
  });

  it.only('Should update not asset configs', () => {
    cy.getMockData(
      ({
        SITE_CONFIGS_INITIAL,
        INITIAL_CITIES,
        DEFAULT_CITY,
        DEFAULT_LANG,
        SECONDARY_LANG,
        SECONDARY_CITY,
      }) => {
        const initialCity = INITIAL_CITIES[0];
        const initialCityName = initialCity.name[0].value;
        const siteNameConfig = SITE_CONFIGS_INITIAL.find(({ slug }: any) => slug === 'siteName');
        const pageDefaultTitleConfig = SITE_CONFIGS_INITIAL.find(
          ({ slug }: any) => slug === 'pageDefaultTitle',
        );
        const siteNameCityTestId = `${siteNameConfig.slug}-${DEFAULT_CITY}`;
        const pageDefaultTitleDefaultCityTestId = `${pageDefaultTitleConfig.slug}-${DEFAULT_CITY}`;
        const pageDefaultTitleSecondaryCityTestId = `${pageDefaultTitleConfig.slug}-${SECONDARY_CITY}`;

        // Should update not asset configs
        cy.getByCy(`${siteNameConfig.slug}-config`);
        cy.getByCy(`${siteNameConfig.slug}-config-name`);
        cy.getByCy(siteNameCityTestId).should('contain', initialCityName).click();

        // Multi lang field
        cy.getByCy(pageDefaultTitleDefaultCityTestId).click();
        cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-${DEFAULT_LANG}`)
          .clear()
          .type(newSiteDefaultTitle);
        cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-accordion-${SECONDARY_LANG}`).click();
        cy.getByCy(`${pageDefaultTitleDefaultCityTestId}-${SECONDARY_LANG}`)
          .clear()
          .type(newSiteDefaultTitle);

        cy.getByCy(pageDefaultTitleSecondaryCityTestId).click();
        cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-${DEFAULT_LANG}`)
          .clear()
          .type(newSiteDefaultTitle);
        cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-accordion-${SECONDARY_LANG}`).click();
        cy.getByCy(`${pageDefaultTitleSecondaryCityTestId}-${SECONDARY_LANG}`)
          .clear()
          .type(newSiteDefaultTitle);
        cy.getByCy(`${pageDefaultTitleConfig.slug}-submit`).click();
        cy.getByCy('error-notification').should('not.exist');

        // cy.getByCy(`site-configs`).should('exist');
        // cy.getByCy('inputs[0].value[0]').clear().type(newSiteName);

        // Should create additional field of config and remove it
        // cy.getByCy('inputs[2].value[0]-add').click();
        // cy.getByCy('inputs[2].value[1]').type(newSitePhone);
        // cy.getByCy('site-configs-submit').click();
        // cy.getByCy('inputs[0].value[0]').should('have.value', newSiteName);
        // cy.getByCy('inputs[2].value[1]').should('have.value', newSitePhone);
        // cy.getByCy('inputs[2].value[1]-remove').click();
        // cy.getByCy(`remove-field-modal`).should('exist');
        // cy.getByCy(`confirm`).click();
        // cy.getByCy('inputs[2].value[1]').should('not.exist');
      },
    );
  });
});
