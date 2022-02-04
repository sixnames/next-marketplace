import { getProjectLinks } from 'lib/getProjectLinks';

describe('Tasks', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.myTasks.url, 'contentManager@gmail.com');
  });

  it('Should display user tasks', () => {
    cy.getByCy('tasks-list').should('exist');

    // should accept task
    cy.getByCy('Заполнить атрибуты-create').click();
    cy.getByCy('accept-task-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy('Заполнить атрибуты-executor').should('exist');
  });
});
