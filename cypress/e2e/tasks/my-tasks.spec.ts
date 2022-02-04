import { getProjectLinks } from 'lib/getProjectLinks';

const taskItemId = '000001';
describe('Tasks', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.myTasks.url, 'contentManager@gmail.com');
  });

  it('Should display user tasks', () => {
    cy.getByCy('tasks-list').should('exist');

    // should accept task
    cy.getByCy(`${taskItemId}-create`).click();
    cy.getByCy('accept-task-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${taskItemId}-executor`).should('exist');
    cy.visitLinkHref(`${taskItemId}-product-link`);
    cy.getByCy(`draft-warning`).should('exist');
  });
});
