import { DEFAULT_LOCALE } from 'config/common';
import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { getCmsCompanyLinks } from '../../../lib/linkUtils';

describe('Promo', () => {
  const links = getCmsCompanyLinks({
    companyId: fixtureIds.companyA,
  });

  beforeEach(() => {
    cy.testAuth(links.promo.parentLink);
  });

  it('Should CRUD promo', () => {
    cy.clock(1624449303350);
    const newPromoName = 'newPromoName';
    const newPromoDiscount = '33';
    const newPromoCashBack = '44';
    const updatedPromoName = 'updatedPromoName';
    const updatedPromoDiscount = '55';
    const updatedPromoCashBack = '66';

    cy.getByCy('promo-list').should('exist');

    // should create promo
    cy.getByCy(`create-promo`).click();
    cy.getByCy('create-promo-modal').should('exist');
    cy.getByCy(`name-${DEFAULT_LOCALE}`).type(newPromoName);
    cy.getByCy(`description-${DEFAULT_LOCALE}`).type(newPromoName);
    cy.getByCy(`discountPercent`).clear().type(newPromoDiscount);
    cy.getByCy(`cashbackPercent`).clear().type(newPromoCashBack);

    cy.get('#startAt').click();
    cy.get('.react-datepicker__day--024').click();

    cy.get('#endAt').click();
    cy.get('.react-datepicker__day--025').click();

    cy.getByCy(`submit-promo`).click();
    cy.wait(1500);
    cy.getByCy(`${newPromoName}-row`).should('exist');

    // should update created promo
    cy.getByCy(`${newPromoName}-update`).click();
    cy.wait(1500);
    cy.getByCy(`promo-details-page`).should('exist');
    cy.getByCy(`name-${DEFAULT_LOCALE}`).clear().type(updatedPromoName);
    cy.getByCy(`description-${DEFAULT_LOCALE}`).clear().type(updatedPromoName);
    cy.getByCy(`discountPercent`).clear().type(updatedPromoDiscount);
    cy.getByCy(`cashbackPercent`).clear().type(updatedPromoCashBack);
    cy.getByCy(`submit-promo`).click();
    cy.visit(links.promo.parentLink);
    cy.wait(1500);
    cy.getByCy(`${updatedPromoName}-row`).should('exist');

    // should delete created promo
    cy.getByCy(`${updatedPromoName}-delete`).click();
    cy.getByCy(`delete-promo-modal`).should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedPromoName}-row`).should('not.exist');
  });
});
