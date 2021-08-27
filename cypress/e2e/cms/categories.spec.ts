import { DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';

describe('Categories', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  it('Should CRUD categories list', () => {
    const categoryName = 'categoryName';
    const childCategoryName = 'childCategoryName';
    const categoryNewName = 'categoryNewName';

    cy.getByCy(`Вино-update`).click();
    cy.getByCy(`categories`).click();
    cy.getByCy(`rubric-categories-list`).should('exist');

    // Should create top level category
    cy.getByCy('create-category').click();
    cy.getByCy('create-category-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(categoryName);

    cy.getByCy(`category-submit`).click();
    cy.wait(1500);
    cy.getByCy(`category-${categoryName}`).should('exist');

    // Should create second level category
    cy.getByCy(`${categoryName}-create`).click();
    cy.getByCy(`create-category-modal`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(childCategoryName);

    cy.getByCy(`category-submit`).click();
    cy.wait(1500);
    cy.getByCy(`category-${childCategoryName}`).should('exist');

    // Should update top level category
    cy.getByCy(`${categoryName}-update`).click();
    cy.wait(1500);
    cy.getByCy('category-details').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(categoryNewName);
    cy.getByCy(`category-submit`).click();
    cy.wait(1500);

    // Should add category attributes group
    cy.getByCy('attributes').click();
    cy.wait(1500);
    cy.getByCy('category-attributes').should('exist');
    cy.getByCy('add-attributes-group').click();
    cy.selectOptionByTestId('attributes-groups', 'Характеристики виски');
    cy.getByCy(`attributes-group-submit`).click();

    // Should update attributes group only in one category
    cy.wait(1500);
    cy.getByCy(`Тип виски-filter-checkbox`).should('not.be.disabled');
    cy.getByCy(`Тип виски-filter-checkbox`).click();
    cy.wait(1500);
    cy.visit(`${ROUTE_CMS}/rubrics`);
    cy.getByCy(`Вино-update`).click();
    cy.getByCy(`attributes`).click();
    cy.getByCy(`Тип виски-filter-checkbox`).should('be.disabled');
    cy.getByCy(`categories`).click();
    cy.wait(1500);

    // Should delete top level category and category children
    cy.getByCy(`${categoryNewName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`category-${categoryNewName}`).should('not.exist');
    cy.getByCy(`category-${childCategoryName}`).should('not.exist');
    cy.visit(`${ROUTE_CMS}/rubrics`);
    cy.getByCy(`Вино-update`).click();
    cy.getByCy(`attributes`).click();
    cy.getByCy(`Тип виски-filter-checkbox`).should('not.exist');
  });
});