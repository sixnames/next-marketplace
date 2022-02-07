import { KEY_CODES } from 'config/common';
import { TaskModel } from 'db/dbModels';
import { getProjectLinks } from 'lib/getProjectLinks';

describe('Tasks', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.myTasks.url, 'contentManager@gmail.com');
  });

  it('Should display user tasks and update product attributes', () => {
    const taskItemId = '000001';
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
    // task log 1
    cy.getByCy('Объем-attribute-clear').click();
    cy.wait(1500);
    // task log 2
    cy.getByCy('Объем-attribute').click();
    cy.getByCy('select-attribute-options-modal').should('exist');
    cy.getByCy('option-350').click();
    cy.wait(2000);
    // count task logs
    cy.getByCy('product-attributes-list').should('exist');
    cy.task('getTaskFromDb', taskItemId).then((taskResult) => {
      const task = taskResult as unknown as TaskModel | null;
      assert((task?.log || []).length === 2, 'Task log should have length 2');
    });

    // clear multi-select attribute
    // task log 3
    cy.getByCy('Виноград-attribute-clear').click();
    cy.wait(1500);
    // task log 4
    cy.getByCy('Виноград-attribute').click();
    cy.getByCy('multi-select-attribute-options-modal').should('exist');
    cy.getByCy('option-Бага').click();
    cy.getByCy('option-Бикал').click();
    cy.getByCy('options-submit').click();
    cy.wait(2000);
    // count task logs
    cy.getByCy('product-attributes-list').should('exist');
    cy.task('getTaskFromDb', taskItemId).then((taskResult) => {
      const task = taskResult as unknown as TaskModel | null;
      assert((task?.log || []).length === 4, 'Task log should have length 4');
    });

    // update number attributes
    // task log 5
    cy.getByCy('Крепость-attribute').clear().type('10');
    cy.getByCy('Количество в упаковке-attribute').clear().type('10');
    cy.getByCy('submit-number-attributes').click();
    cy.wait(2000);
    // count task logs
    cy.getByCy('product-attributes-list').should('exist');
    cy.task('getTaskFromDb', taskItemId).then((taskResult) => {
      const task = taskResult as unknown as TaskModel | null;
      assert((task?.log || []).length === 5, 'Task log should have length 5');
    });

    // update text attributes
    // task log 6
    cy.getByCy('Текстовый-attribute-ru').clear().type('lorem');
    cy.getByCy('submit-text-attributes').click();
    cy.wait(2000);
    // count task logs
    cy.getByCy('product-attributes-list').should('exist');
    cy.task('getTaskFromDb', taskItemId).then((taskResult) => {
      const task = taskResult as unknown as TaskModel | null;
      assert((task?.log || []).length === 6, 'Task log should have length 6');
    });
  });

  it('Should display user tasks and update product assets', () => {
    const taskItemId = '000002';
    cy.getByCy('tasks-list').should('exist');

    // visit task product
    cy.visitLinkHref(`${taskItemId}-product-link`);
    cy.wait(1500);
    cy.getByCy('assets').click();
    cy.wait(1500);
    cy.getByCy('product-assets-list').should('exist');

    // upload asset
    // task log 1
    cy.getByCy('drop-zone-input').attachFile('test-image-3.png', { subjectType: 'drag-n-drop' });
    cy.wait(1500);
    cy.getByCy('product-assets-list').should('exist');
    cy.get('[data-rbd-drag-handle-draggable-id]').should('have.length', 2);
    cy.wait(2000);
    cy.task('getTaskFromDb', taskItemId).then((taskResult) => {
      const task = taskResult as unknown as TaskModel | null;
      assert((task?.log || []).length === 1, 'Task log should have length 1');
    });

    // update asset index
    // task log 2
    cy.dndReorder({
      testId: 'asset-preview-1',
      moveKeyCode: KEY_CODES.arrowLeft,
    });
    cy.wait(1500);
    cy.getByCy('product-assets-list').should('exist');
    cy.wait(2000);
    cy.task('getTaskFromDb', taskItemId).then((taskResult) => {
      const task = taskResult as unknown as TaskModel | null;
      assert((task?.log || []).length === 2, 'Task log should have length 2');
    });

    // delete asset
    // task log 3
    cy.getByCy('asset-preview-remove-1').click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.get('[data-rbd-drag-handle-draggable-id]').should('have.length', 1);
    cy.wait(2000);
    cy.task('getTaskFromDb', taskItemId).then((taskResult) => {
      const task = taskResult as unknown as TaskModel | null;
      assert((task?.log || []).length === 3, 'Task log should have length 3');
    });
  });

  it.only('Should display user tasks and update product categories', () => {
    const taskItemId = '000004';
    cy.getByCy('tasks-list').should('exist');

    // visit task product
    cy.visitLinkHref(`${taskItemId}-product-link`);
    cy.wait(1500);
    cy.getByCy('categories').click();
    cy.wait(1500);
    cy.getByCy('product-categories-list').should('exist');

    // update categories
    // task log 1
    cy.getByCy('Односолодовый A-1-checkbox').click();
    cy.wait(1500);
    cy.getByCy('Односолодовый A-1-checkbox').should('not.be.checked');
    cy.wait(2000);
    cy.task('getTaskFromDb', taskItemId).then((taskResult) => {
      const task = taskResult as unknown as TaskModel | null;
      assert((task?.log || []).length === 1, 'Task log should have length 1');
    });
  });
});
