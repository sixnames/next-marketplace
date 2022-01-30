import {
  TASK_PRICE_ACTION_ADDED,
  TASK_PRICE_ACTION_UPDATED,
  TASK_PRICE_SLUG_PRODUCT_ASSETS,
  TASK_PRICE_SLUG_PRODUCT_SEO_CONTENT,
  TASK_PRICE_TARGET_FIELD,
  TASK_PRICE_TARGET_SYMBOL,
  TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
} from '../../../config/constantSelects';
import { getCmsLinks } from '../../../lib/linkUtils';

describe('Task variants', () => {
  const links = getCmsLinks({});
  beforeEach(() => {
    cy.testAuth(links.taskVariants.parentLink);
  });

  it('Should CRUD task variants', () => {
    const createdTaskVariant = 'createdTaskVariant';
    const updatedTaskVariant = 'updatedTaskVariant';

    cy.getByCy('task-variants-list').should('exist');

    // should create
    cy.getByCy('create-task-variant-button').click();
    cy.wait(1500);
    cy.getByCy('create-task-variant-page').should('exist');
    cy.getByCy('nameI18n-ru').type(createdTaskVariant);
    cy.getByCy('task-variant-slug').select(TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT);
    cy.getByCy('add-task-variant-price-button').click();
    cy.getByCy('task-variant-price-modal').should('exist');
    cy.getByCy('price').type('10');
    cy.getByCy('target').select(TASK_PRICE_TARGET_SYMBOL);
    cy.getByCy('slug').select(TASK_PRICE_SLUG_PRODUCT_SEO_CONTENT);
    cy.getByCy('action').select(TASK_PRICE_ACTION_ADDED);
    cy.getByCy('task-variant-price-submit').click();
    cy.getByCy('task-variant-price-0-update').should('exist');
    cy.getByCy('task-variant-submit').click();
    cy.wait(1500);
    cy.getByCy('task-variants-list').should('exist');
    cy.getByCy(createdTaskVariant).should('exist');

    // should update
    cy.getByCy(`${createdTaskVariant}-update`).click();
    cy.getByCy('update-task-variant-page').should('exist');
    cy.getByCy('add-task-variant-price-button').click();
    cy.getByCy('task-variant-price-modal').should('exist');
    cy.getByCy('price').type('100');
    cy.getByCy('target').select(TASK_PRICE_TARGET_FIELD);
    cy.getByCy('slug').select(TASK_PRICE_SLUG_PRODUCT_ASSETS);
    cy.getByCy('action').select(TASK_PRICE_ACTION_UPDATED);
    cy.getByCy('task-variant-price-submit').click();
    cy.wait(1500);
    cy.getByCy('task-variant-price-1-update').click();
    cy.getByCy('price').clear().type('999');
    cy.getByCy('task-variant-price-submit').click();
    cy.wait(1500);
    cy.getByCy('nameI18n-ru').clear().type(updatedTaskVariant);
    cy.getByCy('task-variant-submit').click();
    cy.wait(1500);

    // should delete price
    cy.getByCy('task-variant-price-1-delete').click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy('task-variant-price-1-delete').should('not.exist');

    // should delete
    cy.visit(links.taskVariants.parentLink);
    cy.getByCy('task-variants-list').should('exist');
    cy.getByCy(createdTaskVariant).should('not.exist');
    cy.getByCy(updatedTaskVariant).should('exist');
    cy.getByCy(`${updatedTaskVariant}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(updatedTaskVariant).should('not.exist');
  });
});
