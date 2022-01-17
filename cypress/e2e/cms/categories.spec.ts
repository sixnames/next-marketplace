import { DEFAULT_LOCALE } from 'config/common';
import { getConsoleRubricLinks } from '../../../lib/linkUtils';
import { fixtureIds } from '../../fixtures/fixtureIds';

describe('Categories', () => {
  const links = getConsoleRubricLinks({
    rubricSlug: fixtureIds.rubricWineSlug,
  });
  beforeEach(() => {
    cy.testAuth(links.categories);
  });

  it('Should CRUD categories list', () => {
    const categoryName = 'categoryName';
    const childCategoryName = 'childCategoryName';
    const categoryNewName = 'categoryNewName';

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
    cy.visitBlank(categoryName);
    cy.wait(1500);
    cy.getByCy('category-details').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(categoryNewName);
    cy.getByCy(`category-submit`).click();
    cy.wait(1500);

    // Should add category attributes group
    cy.getByCy('attributes').click();
    cy.wait(1500);
    cy.getByCy('category-attributes').should('exist');
    cy.getByCy('Виноград-checkbox').check();
    cy.wait(1500);
    cy.getByCy('Виноград-checkbox').should('be.checked');

    // Should delete top level category and category children
    cy.visit(links.categories);
    cy.wait(1500);
    cy.getByCy(`${categoryNewName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`category-${categoryNewName}`).should('not.exist');
    cy.getByCy(`category-${childCategoryName}`).should('not.exist');
  });
});
