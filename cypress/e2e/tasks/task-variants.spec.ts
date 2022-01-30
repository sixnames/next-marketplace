import { getCmsLinks } from '../../../lib/linkUtils';

describe('Task variants', () => {
  const links = getCmsLinks({});
  beforeEach(() => {
    cy.testAuth(links.taskVariants.parentLink);
  });

  it('Should CRUD task variants', () => {
    cy.getByCy('task-variants-list').should('exist');
  });
});
