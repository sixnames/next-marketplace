import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Tasks', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.tasks.url);
  });

  it('Should CRUD tasks', () => {
    const createdTask = 'createdTask';
    const updatedTask = 'updatedTask';

    cy.getByCy('tasks-list').should('exist');

    // should create
    cy.getByCy('create-task-button').click();
    cy.wait(1500);
    cy.getByCy('create-task-page').should('exist');
    cy.getByCy('nameI18n-ru').type(createdTask);
    // set variant
    cy.getByCy('task-variant-id').select('f98e8ddd0384f3fd0c9eea41');
    // set executor
    cy.getByCy('add-executor').click();
    cy.getByCy('task-executor-search-modal').should('exist');
    cy.getByCy('000003-create').click();
    cy.getByCy('task-executor-search-modal').should('not.exist');
    cy.getByCy('executor').should('contain', 'Company Manager A');
    // set executor
    cy.getByCy('add-product').click();
    cy.getByCy('task-product-search-modal').should('exist');
    cy.getByCy('tree-Вино').click();
    cy.getByCy('VINO 000144-create').click();
    cy.getByCy('task-product-search-modal').should('not.exist');
    cy.getByCy('product').should('contain', 'VINO 000144');
    // submit
    cy.getByCy('task-submit').click();
    cy.wait(1500);
    cy.getByCy('update-task-page').should('exist');
    cy.visit(links.cms.tasks.url);
    cy.getByCy('tasks-list').should('exist');

    // should update
    cy.getByCy(createdTask).click();
    cy.wait(1500);
    cy.getByCy('update-task-page').should('exist');
    cy.getByCy('nameI18n-ru').clear().type(updatedTask);
    // set state
    cy.getByCy('task-state').select('done');
    // set variant
    cy.getByCy('task-variant-id').select('8fc00a6b3e11b32dcc6377ba');
    // set executor
    cy.getByCy('add-executor').click();
    cy.getByCy('task-executor-search-modal').should('exist');
    cy.getByCy('000004-create').click();
    cy.getByCy('task-executor-search-modal').should('not.exist');
    cy.getByCy('executor').should('contain', 'Company Owner B');
    // set executor
    cy.getByCy('add-product').click();
    cy.getByCy('task-product-search-modal').should('exist');
    cy.getByCy('tree-Вино').click();
    cy.getByCy('VINO 000206-create').click();
    cy.getByCy('task-product-search-modal').should('not.exist');
    cy.getByCy('product').should('contain', 'VINO 000206');
    // submit
    cy.getByCy('task-submit').click();

    // should delete
    cy.visit(links.cms.tasks.url);
    cy.getByCy('tasks-list').should('exist');
    cy.getByCy(`${updatedTask}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(updatedTask).should('not.exist');
  });
});
