import { getProjectLinks } from 'lib/getProjectLinks';

const taskItemId = '000001';
describe('Tasks', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.myTasks.url, 'contentManager@gmail.com');
  });

  it('Should display user tasks', () => {
    cy.getByCy('tasks-list').should('exist');

    // accept task
    cy.getByCy(`${taskItemId}-create`).click();
    cy.getByCy('accept-task-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${taskItemId}-executor`).should('exist');
    cy.visitLinkHref(`${taskItemId}-product-link`);

    // navigate to the task product
    cy.wait(1500);
    cy.getByCy(`draft-warning`).should('exist');

    // update task product attributes
    cy.getByCy('attributes').click();
    cy.wait(1500);
    cy.getByCy('product-attributes-list').should('exist');

    // clear select attribute
    cy.getByCy('Объем-attribute-clear').click();
    cy.wait(1500);
    cy.getByCy('Объем-attribute').click();
    cy.getByCy('select-attribute-options-modal').should('exist');
    cy.getByCy('option-350').click();
    // cy.wait(1500);

    // clear multi-select attribute
    // cy.getByCy('Виноград-attribute-clear').click();
    // cy.wait(1500);
    // cy.getByCy('Виноград-attribute').click();
    // cy.getByCy('multi-select-attribute-options-modal').should('exist');
    // cy.getByCy('option-Бага').click();
    // cy.getByCy('option-Бикал').click();
    // cy.getByCy('options-submit').click();
    // cy.wait(1500);

    // update number attributes
    // cy.getByCy('Крепость-attribute').clear().type('10');
    // cy.getByCy('Количество в упаковке-attribute').clear().type('10');
    // cy.getByCy('submit-number-attributes').click();
    // cy.wait(1500);

    // update text attributes
    // cy.getByCy('Текстовый-attribute-ru').clear().type('lorem');
    // cy.getByCy('submit-text-attributes').click();
  });
});
