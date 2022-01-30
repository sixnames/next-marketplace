import { getCmsLinks } from '../../../lib/linkUtils';

describe('Task variants', () => {
  const links = getCmsLinks({});
  beforeEach(() => {
    cy.testAuth(links.taskVariants.parentLink);
  });

  it('Should CRUD task variants', () => {
    cy.getByCy('task-variants-list').should('exist');

    // should create
    cy.getByCy('create-task-variant-button').click();
    cy.wait(1500);
    cy.getByCy('create-task-variant-page').should('exist');
  });
});
