import schema from '../../../src/generated/introspectionSchema.json';
import {
  ME_AS_ADMIN,
  MOCK_ATTRIBUTE_NUMBER,
  MOCK_ATTRIBUTE_SELECT,
  MOCK_ATTRIBUTE_STRING,
  MOCK_OPTIONS,
  MOCK_PRODUCT_B_PRODUCT,
  MOCK_PRODUCT_FOR_DELETE,
  MOCK_PRODUCT_NEW_PRODUCT,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE,
  MOCK_RUBRIC_LEVEL_THREE_B,
  MOCK_RUBRIC_LEVEL_THREE_TABLES_B,
  MOCK_RUBRIC_LEVEL_TWO,
  MOCK_RUBRIC_LEVEL_TWO_TABLES,
  QUERY_DATA_LAYOUT_FILTER_ENABLED,
} from '../../../src/config';

const mockProductForDelete = MOCK_PRODUCT_FOR_DELETE.name[0].value;
const mockProductB = MOCK_PRODUCT_B_PRODUCT.name[0].value;
const mockRubricLevelOne = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockRubricLevelTwo = MOCK_RUBRIC_LEVEL_TWO.name[0].value;
const mockRubricLevelThree = MOCK_RUBRIC_LEVEL_THREE.name[0].value;
const mockRubricLevelThreeB = MOCK_RUBRIC_LEVEL_THREE_B.name[0].value;
const mockTablesRubricLevelTwo = MOCK_RUBRIC_LEVEL_TWO_TABLES.name[0].value;
const mockTablesRubricLevelThree = MOCK_RUBRIC_LEVEL_THREE_TABLES_B.name[0].value;

const mockProductNewName = MOCK_PRODUCT_NEW_PRODUCT.name[0].value;
const mockProductNewCardName = MOCK_PRODUCT_NEW_PRODUCT.cardName[0].value;
const mockProductNewCardPrice = MOCK_PRODUCT_NEW_PRODUCT.price;
const mockProductNewCarDescription = MOCK_PRODUCT_NEW_PRODUCT.description[0].value;

const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockRubricLevelTwoName = MOCK_RUBRIC_LEVEL_TWO.name[0].value;

const mockAttributeSelectName = MOCK_ATTRIBUTE_SELECT.name[0].value;
const mockAttributeSelectValue = MOCK_OPTIONS[0].name[0].value;
const mockAttributeMultipleSelectValueA = MOCK_OPTIONS[0].name[0].value;
const mockAttributeMultipleSelectValueB = MOCK_OPTIONS[1].name[0].value;
const mockAttributeStringName = MOCK_ATTRIBUTE_STRING.name[0].value;
const mockAttributeNumberName = MOCK_ATTRIBUTE_NUMBER.name[0].value;

describe('Products list', () => {
  beforeEach(() => {
    cy.server();
    cy.mockGraphql({
      schema,
      operations: {
        Initial: {
          me: ME_AS_ADMIN,
        },
      },
    });

    cy.createTestData();
    cy.visit(`/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should delete product from city or DB', () => {
    cy.getByCy(`products-list`).should('exist');
    cy.getByCy(`${mockProductForDelete}-delete`).click();
    cy.getByCy('confirm').click();
    cy.getByCy(mockProductForDelete).should('not.exist');
    cy.closeNotification();
  });
});

// Used separate describe block for file upload mutation
// cypress-graphql-mock module throws error on file upload
describe('New products creation', () => {
  beforeEach(() => {
    cy.createTestData();
    // sign in as admin
    cy.auth({
      email: ME_AS_ADMIN.email,
      password: ME_AS_ADMIN.password,
      redirect: `/app/cms/products${QUERY_DATA_LAYOUT_FILTER_ENABLED}`,
    });
  });

  after(() => {
    // cy.clearTestData();
  });

  it('Should open product details', () => {
    cy.getByCy(`${mockProductB}-update`).click();
    cy.getByCy(`product-details`).should('exist');

    // Should update product main image
    cy.getByCy('file-preview-remove-0').click();
    cy.getByCy('remove-image-confirm').click();
    cy.getByCy('product-images').attachFile('test-image-1.jpg', { subjectType: 'drag-n-drop' });
    cy.getByCy('submit-product').click();
    cy.getByCy(`success-notification`).should('exist');

    // Should update product main fields
    cy.getByCy('product-name').clear().type(mockProductNewName);
    cy.getByCy('product-card-name').clear().type(mockProductNewCardName);
    cy.getByCy('product-price').clear().clear().type(`${mockProductNewCardPrice}`);
    cy.getByCy('product-description').clear().type(mockProductNewCarDescription);
    cy.getByCy('submit-product').click();
    cy.getByCy(`success-notification`).should('exist');

    // Should update product attributes
    cy.getByCy(`tree-link-${mockRubricLevelThree}-checkbox`).check();
    cy.getByCy(`tree-link-${mockTablesRubricLevelThree}-checkbox`).check();
    cy.getByCy(`attributesSource`).should('be.disabled');
    cy.getByCy('attributes-source-reset').click();
    cy.selectOptionByTestId(
      `attributesSource`,
      `${mockRubricLevelOneName}_>_${mockTablesRubricLevelTwo}`,
    );
    cy.getByCy(mockAttributeStringName).type('string');
    cy.getByCy(`${mockAttributeStringName}-showInCard-checkbox`).check();
    cy.getByCy(mockAttributeNumberName).type('999');
    cy.getByCy(`${mockAttributeNumberName}-showInCard-checkbox`).check();
    cy.getByCy('submit-product').click();
    cy.getByCy(`success-notification`).should('exist');
  });

  it.only('Should create product and add it to the rubric', () => {
    cy.getByCy(`product-create`).click();

    // attach images
    cy.getByCy('product-images').attachFile('test-image-3.jpg', { subjectType: 'drag-n-drop' });

    // fill inputs
    cy.getByCy('product-name').type(mockProductNewName);
    cy.getByCy('product-card-name').type(mockProductNewCardName);
    cy.getByCy('product-price').clear().type(`${mockProductNewCardPrice}`);
    cy.getByCy('product-description').type(mockProductNewCarDescription);
    cy.getByCy(`tree-link-${mockRubricLevelThree}-checkbox`).check();
    cy.getByCy(`tree-link-${mockRubricLevelThreeB}-checkbox`).check();
    cy.selectOptionByTestId(`attributesSource`, `${mockRubricLevelOne}_>_${mockRubricLevelTwo}`);

    // fill attributes
    cy.selectOptionByTestId(
      `attributesSource`,
      `${mockRubricLevelOneName}_>_${mockRubricLevelTwoName}`,
    );
    cy.getByCy(`${mockAttributeMultipleSelectValueA}-checkbox`).check();
    cy.getByCy(`${mockAttributeMultipleSelectValueB}-checkbox`).check();

    cy.selectOptionByTestId(mockAttributeSelectName, mockAttributeSelectValue);
    cy.getByCy(`${mockAttributeSelectName}-showInCard-checkbox`).check();

    cy.getByCy(mockAttributeStringName).type('string');
    cy.getByCy(`${mockAttributeStringName}-showInCard-checkbox`).check();

    cy.getByCy(mockAttributeNumberName).type('999');
    cy.getByCy(`${mockAttributeNumberName}-showInCard-checkbox`).check();

    cy.getByCy('submit-new-product').click();
    cy.getByCy(mockProductNewName).should('exist');
  });
});
