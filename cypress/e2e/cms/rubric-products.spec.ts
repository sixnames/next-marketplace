import { ADULT_KEY, ADULT_TRUE, ROUTE_CMS } from 'config/common';

describe('Rubric products', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  it('Should CRUD rubric product', () => {
    const mainRubricName = 'Вино';
    const newProductName = 'newProductName';
    const newProductDescription = 'newProductDescription';
    const updatedProductName = 'updatedProductName';
    const updatedProductDescription = 'updatedProductDescription';

    // Should add product to rubric
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy(`create-rubric-product`).click();
    cy.getByCy('create-new-product-modal').should('exist');
    cy.getByCy('nameI18n-ru').type(newProductName);
    cy.getByCy('originalName').type(newProductName);
    cy.getByCy('descriptionI18n-ru').type(newProductDescription);
    cy.getByCy(`submit-new-product`).click();
    cy.wait(1500);
    cy.getByCy('product-details').should('exist');

    // Should update rubric product
    cy.getByCy(`active-checkbox`).check();
    cy.getByCy('nameI18n-ru').clear().type(updatedProductName);
    cy.getByCy('originalName').clear().type(updatedProductName);
    cy.getByCy('descriptionI18n-ru').clear().type(updatedProductDescription);
    cy.getByCy(`submit-product`).click();
    cy.wait(1500);
    cy.getByCy(`${updatedProductName}-product-title`).should('exist');

    // Should display product assets page
    cy.getByCy('assets').click();
    cy.getByCy('product-assets-list').should('exist');

    // Should delete product from rubric
    cy.visit(`${ROUTE_CMS}/rubrics`);
    cy.getByCy(`${mainRubricName}-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy('products-search-input').type(updatedProductName);
    cy.getByCy('products-search-submit').click();
    cy.wait(1500);
    cy.getByCy(`${updatedProductName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy('products-search-input').type(updatedProductName);
    cy.getByCy('products-search-submit').click();
    cy.getByCy(`${updatedProductName}-delete`).should('not.exist');
  });

  it('Should CRUD product attributes', () => {
    cy.getByCy(`Вино-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy('product-link-0').click();
    cy.wait(1500);
    cy.getByCy('attributes').click();
    cy.getByCy('product-attributes-list').should('exist');

    // clear select attribute
    cy.getByCy('Объем-attribute-clear').click();
    cy.wait(1500);

    // open options modal
    cy.getByCy('Объем-attribute').click();
    cy.getByCy('select-attribute-options-modal').should('exist');
    cy.getByCy('option-350').click();
    cy.getByCy('options-submit').click();
    cy.wait(1500);

    // clear multi-select attribute
    cy.getByCy('Виноград-attribute-clear').click();
    cy.wait(1500);

    // open options modal
    cy.getByCy('Виноград-attribute').click();
    cy.getByCy('multi-select-attribute-options-modal').should('exist');
    cy.getByCy('option-Бага').click();
    cy.getByCy('option-Бикал').click();
    cy.getByCy('options-submit').click();
    cy.wait(1500);

    // update number attributes
    cy.getByCy('Крепость-attribute').clear().type('10');
    cy.getByCy('Количество в упаковке-attribute').clear().type('10');
    cy.getByCy('submit-number-attributes').click();

    // update text attributes
    cy.getByCy('Описание-attribute-ru').clear().type('lorem');
    cy.getByCy('submit-text-attributes').click();
  });

  it('Should CRUD product connections', () => {
    cy.getByCy(`Вино-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy('product-link-0').click();
    cy.wait(1500);
    cy.getByCy('connections').click();
    cy.getByCy('product-connections-list').should('exist');
    cy.getByCy('create-connection').click();
    cy.getByCy('create-connection-modal').should('exist');
    cy.selectOptionByTestId('attributeId', 'Объем');
    cy.getByCy('create-connection-submit').click();
    cy.wait(1500);
    cy.getByCy('Объем-connection-product-create').click();
    cy.getByCy('add-product-to-connection-modal').should('exist');
    cy.getByCy('product-search-list-0-row').then(($row: any) => {
      const button = $row.find('button');
      cy.wrap(button).click();
    });
    cy.wait(1500);

    // delete first product
    cy.getByCy('Объем-connection-list-0-row').then(($row: any) => {
      const button = $row.find('button');
      cy.wrap(button).click();
    });
    cy.getByCy('confirm').click();
    cy.wait(1500);

    // delete second product
    cy.getByCy('Объем-connection-list-0-row').then(($row: any) => {
      const button = $row.find('button');
      cy.wrap(button).click();
    });
    cy.getByCy('confirm').click();
    cy.wait(1500);

    cy.getByCy('Объем-connection-product-create').should('not.exist');
  });

  it('Should CRUD product brands', () => {
    cy.getByCy(`Вино-update`).click();
    cy.getByCy('rubric-products-list').should('exist');
    cy.getByCy('product-link-0').click();
    cy.wait(1500);
    cy.getByCy('brands').click();
    cy.getByCy('product-brands-list').should('exist');

    // brand
    cy.getByCy('clear-brand').click();
    cy.wait(1500);
    cy.getByCy('brand-collection-input').should('contain', 'Не назначено');
    cy.getByCy('brand-input').click();
    cy.getByCy('brand-options-modal').should('exist');
    cy.getByCy('option-Brand B').click();
    cy.getByCy('options-submit').click();
    cy.wait(1500);
    cy.getByCy('brand-input').should('contain', 'Brand B');

    // brand collection
    cy.getByCy('brand-collection-input').click();
    cy.getByCy('brand-collection-options-modal').should('exist');
    cy.getByCy('option-Brand collection B').click();
    cy.getByCy('options-submit').click();
    cy.wait(1500);
    cy.getByCy('brand-collection-input').should('contain', 'Brand collection B');

    // manufacturer
    cy.getByCy('clear-manufacturer').click();
    cy.wait(1500);
    cy.getByCy('manufacturer-input').click();
    cy.getByCy('manufacturer-options-modal').should('exist');
    cy.getByCy('option-Manufacturer B').click();
    cy.getByCy('options-submit').click();
    cy.wait(1500);
    cy.getByCy('manufacturer-input').should('contain', 'Manufacturer B');
  });
});
