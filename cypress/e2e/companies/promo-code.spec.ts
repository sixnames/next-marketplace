import { fixtureIds } from 'cypress/fixtures/fixtureIds';
import { getCmsCompanyLinks } from '../../../lib/linkUtils';

describe('Promo code', () => {
  const links = getCmsCompanyLinks({
    companyId: fixtureIds.companyA,
    promoId: fixtureIds.promoACompanyA,
  });
  beforeEach(() => {
    cy.testAuth(links.promo.code.parentLink);
  });

  it('Should CRUD promo code', () => {
    cy.getByCy(`promo-code-list-page`).should('exist');
  });
});
