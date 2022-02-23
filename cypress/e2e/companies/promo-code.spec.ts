import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Promo code', () => {
  const links = getProjectLinks({
    companyId: fixtureIds.companyA,
    promoId: fixtureIds.promoACompanyA,
  });
  beforeEach(() => {
    cy.testAuth(links.cms.companies.companyId.promo.details.promoId.code.url);
  });

  it('Should CRUD promo code', () => {
    const createdPromoCode = 'created-promo-code';
    const updatedPromoCode = 'updated-promo-code';
    cy.getByCy(`promo-code-list-page`).should('exist');

    // should create
    cy.getByCy(`create-promo-code`).click();
    cy.getByCy(`create-promo-code-modal`).should('exist');
    cy.getByCy('code-input').type(createdPromoCode);
    cy.getByCy('submit-promo-code').click();
    cy.wait(1500);

    // should update
    cy.getByCy(`promo-code-details-page`).should('exist');
    cy.getByCy('code-input').clear().type(updatedPromoCode);
    cy.getByCy('submit-promo-code').click();
    cy.wait(1500);
    cy.visit(links.cms.companies.companyId.promo.details.promoId.code.url);
    cy.getByCy(updatedPromoCode).should('exist');

    // should delete
    cy.getByCy('code-delete').click();
    cy.getByCy('delete-promo-code-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy('code').should('not.exist');
  });
});
