import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Promo products', () => {
  const links = getProjectLinks({
    companyId: fixtureIds.companyA,
    promoId: fixtureIds.promoACompanyA,
  });
  beforeEach(() => {
    cy.testAuth(links.cms.companies.companyId.promo.details.promoId.rubrics.url);
  });

  it('Should CRUD promo products', () => {
    cy.getByCy(`company-rubrics-list`).should('exist');
    cy.getByCy(`Виски-update`).click();
    cy.wait(1500);
    cy.getByCy(`promo-products-list`).should('exist');

    // add all rubric products
    cy.getByCy('add-all-rubric-products').click();
    cy.wait(1500);
    cy.getByCy(`shop-product-10-checkbox`).should('be.checked');

    // delete all rubric products
    cy.getByCy('delete-all-rubric-products').click();
    cy.wait(1500);
    cy.getByCy(`shop-product-10-checkbox`).should('not.be.checked');
  });
});
