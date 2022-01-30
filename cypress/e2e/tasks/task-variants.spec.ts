import { getCmsLinks } from '../../../lib/linkUtils';

describe('Categories', () => {
  const links = getCmsLinks({});
  beforeEach(() => {
    cy.testAuth(links.taskVariants.parentLink);
  });

  it('Should CRUD categories list', () => {
    cy.getByCy('task-variants-list').should('exist');
  });
});
