const newSiteName = 'new site name';
const newSitePhone = '+89990007766';

describe('Site configs', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/config`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should save site configs', () => {
    // Should update asset configs
    cy.getByCy('siteLogo-remove').click();
    cy.getByCy('siteLogo').attachFile('test-logo.svg', { subjectType: 'drag-n-drop' });
    cy.getByCy('siteLogo-image').should('exist');
    cy.getByCy('pageDefaultPreviewImage-remove').click();
    cy.getByCy('pageDefaultPreviewImage').attachFile('test-image.jpg', {
      subjectType: 'drag-n-drop',
    });
    cy.getByCy('pageDefaultPreviewImage-image').should('exist');

    // Should update not asset configs
    cy.getByCy(`site-configs`).should('exist');
    cy.getByCy('inputs[0].value[0]').clear().type(newSiteName);

    // Should create additional field of config and remove it
    cy.getByCy('inputs[2].value[0]-add').click();
    cy.getByCy('inputs[2].value[1]').type(newSitePhone);
    cy.getByCy('site-configs-submit').click();
    cy.getByCy('inputs[0].value[0]').should('have.value', newSiteName);
    cy.getByCy('inputs[2].value[1]').should('have.value', newSitePhone);
    cy.getByCy('inputs[2].value[1]-remove').click();
    cy.getByCy(`remove-field-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy('inputs[2].value[1]').should('not.exist');
  });
});
