import { getCmsLinks } from '../../../lib/linkUtils';

describe('Tasks', () => {
  const links = getCmsLinks({});
  beforeEach(() => {
    cy.testAuth(links.tasks.parentLink);
  });

  it('Should CRUD task variants', () => {
    const createdTaskVariant = 'createdTask';
    const updatedTaskVariant = 'updatedTask';
    console.log({
      createdTaskVariant,
      updatedTaskVariant,
    });
    cy.getByCy('tasks-list').should('exist');
  });
});
