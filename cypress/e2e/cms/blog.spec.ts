import { DEFAULT_LOCALE, ROUTE_CMS } from 'config/common';

describe('Blog', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/blog`);
  });

  it('Should CRUD product attributes', () => {
    const attributeNewName = 'attributeNewName';
    const updatedAttributeName = 'updatedAttributeName';

    const postNewTitle = 'postNewTitle';
    const postNewDescription = 'postNewDescription';
    const updatedPostTitle = 'updatedPostTitle';
    const updatedPostDescription = 'updatedPostDescription';

    cy.getByCy(`sub-nav-attributes`).click();

    // should create attribute
    cy.getByCy(`create-blog-attribute`).click();
    cy.getByCy('blog-attribute-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(attributeNewName);
    cy.selectOptionByTestId(`optionsGroupId`, 'Год');
    cy.getByCy(`blog-attribute-submit`).click();
    cy.wait(1500);
    cy.getByCy(`${attributeNewName}-row`).should('exist');

    // should update attribute
    cy.getByCy(`${attributeNewName}-update`).click();
    cy.getByCy('blog-attribute-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedAttributeName);
    cy.getByCy(`blog-attribute-submit`).click();
    cy.wait(1500);
    cy.getByCy(`${attributeNewName}-row`).should('not.exist');
    cy.getByCy(`${updatedAttributeName}-row`).should('exist');

    // should delete attribute
    cy.getByCy(`${updatedAttributeName}-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedAttributeName}-row`).should('not.exist');

    // should create post
    cy.getByCy(`sub-nav-blog`).click();
    cy.wait(1500);
    cy.getByCy('posts-list').should('exist');
    cy.getByCy('create-blog-post').click();
    cy.getByCy('blog-post-modal').should('exist');
    cy.getByCy(`titleI18n-${DEFAULT_LOCALE}`).type(postNewTitle);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(postNewDescription);
    cy.getByCy('blog-post-submit').click();
    cy.wait(1500);

    // should update post
    cy.getByCy(`titleI18n-${DEFAULT_LOCALE}`).clear().type(updatedPostTitle);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(updatedPostDescription);
    cy.getByCy('submit-blog-post').click();
    cy.wait(1500);

    // should update post attribute
    cy.getByCy('Tags-attribute').click();
    cy.getByCy('select-attribute-options-modal').should('exist');
    cy.getByCy('option-Новинка').click();
    cy.getByCy('option-Новости').click();
    cy.getByCy('options-submit').click();
    cy.wait(1500);

    // should clear post attribute
    cy.getByCy('Tags-attribute-clear').click();
    cy.wait(1500);

    // should delete post
    cy.visit(`${ROUTE_CMS}/blog`);
    cy.getByCy(`${updatedPostTitle}-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedPostTitle}-row`).should('not.exist');
  });
});
