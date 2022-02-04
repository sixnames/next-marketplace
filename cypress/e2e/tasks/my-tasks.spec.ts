import { getProjectLinks } from 'lib/getProjectLinks';

describe('Tasks', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.myTasks.url, 'contentManager@gmail.com');
  });

  it('Should display user tasks', () => {
    cy.getByCy('tasks-list').should('exist');
  });
});
