import { KEY_CODES } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

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
    cy.getByCy('product-attributes-list').should('exist');

    // update task product attributes
    // clear select attribute
    // task log 1
    cy.getByCy('Объем-attribute-clear').click();
    cy.wait(1500);
    // task log 2
    cy.getByCy('Объем-attribute').click();
    cy.getByCy('select-attribute-options-modal').should('exist');
    cy.getByCy('option-350').click();
    cy.wait(1500);
    cy.getByCy('product-attributes-list').should('exist');
    cy.countTaskLogs(taskItemId, 2);

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
    cy.wait(1500);
    cy.getByCy('product-attributes-list').should('exist');
    cy.countTaskLogs(taskItemId, 4);

    // update number attributes
    // task log 5
    cy.getByCy('Крепость-attribute').clear().type('10');
    cy.getByCy('Количество в упаковке-attribute').clear().type('10');
    cy.getByCy('submit-number-attributes').click();
    cy.wait(1500);
    cy.getByCy('product-attributes-list').should('exist');
    cy.countTaskLogs(taskItemId, 5);

    // update text attributes
    // task log 6
    cy.getByCy('Текстовый-attribute-ru').clear().type('lorem');
    cy.getByCy('submit-text-attributes').click();
    cy.wait(1500);
    cy.getByCy('product-attributes-list').should('exist');
    cy.countTaskLogs(taskItemId, 6);
  });

  it('Should display user tasks and update product assets', () => {
    const taskItemId = '000002';
    cy.getByCy('tasks-list').should('exist');

    // visit task product
    cy.visitLinkHref(`${taskItemId}-product-link`);
    cy.wait(1500);
    cy.getByCy('product-assets-list').should('exist');

    // upload asset
    // task log 1
    cy.getByCy('drop-zone-input').attachFile('test-image-3.png', { subjectType: 'drag-n-drop' });
    cy.wait(1500);
    cy.getByCy('product-assets-list').should('exist');
    cy.get('[data-rbd-drag-handle-draggable-id]').should('have.length', 2);
    cy.countTaskLogs(taskItemId, 1);

    // update asset index
    // task log 2
    cy.dndReorder({
      testId: 'asset-preview-1',
      moveKeyCode: KEY_CODES.arrowLeft,
    });
    cy.wait(1500);
    cy.getByCy('product-assets-list').should('exist');
    cy.countTaskLogs(taskItemId, 2);

    // delete asset
    // task log 3
    cy.getByCy('asset-preview-remove-1').click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.get('[data-rbd-drag-handle-draggable-id]').should('have.length', 1);
    cy.countTaskLogs(taskItemId, 3);
  });

  it('Should display user tasks and update product categories', () => {
    const taskItemId = '000004';
    cy.getByCy('tasks-list').should('exist');

    // visit task product
    cy.visitLinkHref(`${taskItemId}-product-link`);
    cy.wait(1500);
    cy.getByCy('product-categories-list').should('exist');

    // update categories
    // task log 1
    cy.getByCy('Односолодовый A-1-checkbox').click();
    cy.wait(1500);
    cy.getByCy('Односолодовый A-1-checkbox').should('not.be.checked');
    cy.countTaskLogs(taskItemId, 1);

    // task log 2
    cy.getByCy('Купажированный-view-checkbox').click();
    cy.wait(1500);
    cy.getByCy('Купажированный-view-checkbox').should('be.checked');
    cy.countTaskLogs(taskItemId, 2);
  });

  it('Should display user tasks and update product variants', () => {
    const taskItemId = '000005';
    cy.getByCy('tasks-list').should('exist');

    // visit task product
    cy.visitLinkHref(`${taskItemId}-product-link`);
    cy.wait(1500);
    cy.getByCy('product-variants-list').should('exist');

    // update variants
    // task log 1
    cy.getByCy('create-variant').click();
    cy.getByCy('create-variant-modal').should('exist');
    cy.selectOptionByTestId('attributeId', 'Объем');
    cy.getByCy('create-variant-submit').click();
    cy.wait(1500);
    cy.countTaskLogs(taskItemId, 1);

    // task log 2
    cy.getByCy('Объем-variant-product-create').click();
    cy.getByCy('add-product-to-variant-modal').should('exist');
    cy.getByCy('product-search-list-1-row').then(($row: any) => {
      const button = $row.find('button');
      cy.wrap(button).click();
    });
    cy.countTaskLogs(taskItemId, 2);

    // task log 3
    // delete first product
    cy.getByCy('2-1-delete').click();
    cy.getByCy('confirm').click();
    cy.countTaskLogs(taskItemId, 3);

    // task log 4
    // delete first product
    cy.getByCy('2-0-delete').click();
    cy.getByCy('confirm').click();
    cy.countTaskLogs(taskItemId, 4);
  });

  it('Should display user tasks and update product brand / collection / manufacturer', () => {
    const taskItemId = '000006';
    cy.getByCy('tasks-list').should('exist');

    // visit task product
    cy.visitLinkHref(`${taskItemId}-product-link`);
    cy.wait(1500);
    cy.getByCy('product-brands-list').should('exist');

    // update brand / collection / manufacturer
    // task log 1
    cy.getByCy('brand-input-clear').click();
    cy.wait(1500);
    // task log 2
    cy.getByCy('brand-input').click();
    cy.getByCy('brand-options-modal').should('exist');
    cy.getByCy('option-Brand B').click();
    cy.countTaskLogs(taskItemId, 2);

    // task log 3
    cy.getByCy('brand-collection-input').click();
    cy.getByCy('brand-collection-options-modal').should('exist');
    cy.getByCy('option-Brand collection B').click();
    cy.wait(1500);
    cy.countTaskLogs(taskItemId, 3);

    // task log 4
    cy.getByCy('manufacturer-input-clear').click();
    cy.wait(1500);

    // task log 5
    cy.getByCy('manufacturer-input').click();
    cy.getByCy('manufacturer-options-modal').should('exist');
    cy.getByCy('option-Manufacturer B').click();
    cy.wait(1500);
    cy.countTaskLogs(taskItemId, 5);
  });

  it('Should display user tasks and update product details', () => {
    const updatedProductName = 'updatedProductName';
    const updatedProductDescription = 'updatedProductDescription';
    const taskItemId = '000007';
    cy.getByCy('tasks-list').should('exist');

    // visit task product
    cy.visitLinkHref(`${taskItemId}-product-link`);
    cy.wait(1500);
    cy.getByCy('product-details').should('exist');

    // update brand / collection / manufacturer
    // task log 1
    cy.getByCy('nameI18n-ru').clear().type(updatedProductName);
    cy.getByCy('originalName').clear().type(updatedProductName);
    cy.getByCy('descriptionI18n-ru').clear().type(updatedProductDescription);
    cy.getByCy(`submit-product`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedProductName}-product-title`).should('exist');
    cy.countTaskLogs(taskItemId, 1);
  });

  it('Should display user tasks and update product details', () => {
    const taskItemId = '000003';
    cy.getByCy('tasks-list').should('exist');

    // visit task product
    cy.visitLinkHref(`${taskItemId}-product-link`);
    cy.wait(1500);
    cy.getByCy('product-card-editor').should('exist');

    // update seo content
    // task log 1
    cy.get('.react-page-cell-insert-new').click();
    cy.contains('Text').click();
    cy.get('[data-slate-node="element"]').click().type('lorem');
    cy.getByCy('card-content-submit').click();
    cy.wait(1500);
    cy.contains('lorem').should('exist');
    cy.countTaskLogs(taskItemId, 1);
  });
});
