import schema from '../../../src/generated/introspectionSchema.json';
import {
  ME_AS_ADMIN,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE,
  MOCK_RUBRIC_LEVEL_TWO,
  MOCK_RUBRIC_TYPE_EQUIPMENT,
  MOCK_RUBRIC_TYPE_STAGE,
} from '@rg/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';

const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockRubricLevelTwoName = MOCK_RUBRIC_LEVEL_TWO.name[0].value;
const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE.name[0].value;
const mockRubricType = MOCK_RUBRIC_TYPE_EQUIPMENT.name[0].value;
const mockNewRubric = 'cy-test-new-rubric';

describe('Rubrics', () => {
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
    cy.visit(`/rubrics?${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should have rubrics list', () => {
    cy.getByCy(`rubrics-tree`).should('exist');
  });

  it('Should show validation errors on new rubric creation', () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`name-error`).should('exist');
    cy.getByCy(`catalogueName-error`).should('exist');
    cy.getByCy(`type-error`).should('exist');
  });

  it('Should create a new rubric', () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockNewRubric);
    cy.getByCy(`catalogue-name`).type(mockNewRubric);
    cy.selectOptionByTestId(`rubric-type`, mockRubricType);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.getByCy(`${mockNewRubric}`).should('exist');
  });

  it(`Shouldn't create a new rubric if exists on first level`, () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelOneName);
    cy.selectOptionByTestId(`rubric-type`, mockRubricType);
    cy.getByCy(`rubric-submit`).click();

    cy.getByCy(`error-notification`).should('exist');
  });

  it('Should create a new rubric on second level', () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockNewRubric);
    cy.getByCy(`catalogue-name`).type(mockNewRubric);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.getByCy(`tree-${mockNewRubric}`).contains(mockNewRubric);
  });

  it(`Shouldn't create a new rubric if exists on second level`, () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelTwoName);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.getByCy(`rubric-submit`).click();

    cy.getByCy(`error-notification`).should('exist');
  });

  it('Should create a new rubric on third level', () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockNewRubric);
    cy.getByCy(`catalogue-name`).type(mockNewRubric);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.selectOptionByTestId(`subParent`, mockRubricLevelTwoName);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.getByCy(`tree-${mockNewRubric}`).contains(mockNewRubric);
  });

  it(`Shouldn't create a new rubric if exists on third level`, () => {
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');

    cy.getByCy(`rubric-name`).type(mockRubricLevelThreeName);
    cy.getByCy(`catalogue-name`).type(mockRubricLevelThreeName);
    cy.selectOptionByTestId(`parent`, mockRubricLevelOneName);
    cy.selectOptionByTestId(`subParent`, mockRubricLevelTwoName);
    cy.getByCy(`rubric-submit`).click();

    cy.getByCy(`error-notification`).should('exist');
  });

  it('Should have rubric details tab', () => {
    cy.getByCy(`${mockRubricLevelOneName}`).click();
    cy.getByCy('rubric-name').should('exist');
    cy.getByCy('catalogue-name').should('exist');
    cy.getByCy('rubric-type').should('exist');
  });

  it('Should have rubric type on first level only', () => {
    cy.getByCy(`${mockRubricLevelTwoName}`).click();
    cy.getByCy('rubric-type').should('not.exist');

    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.getByCy('rubric-type').should('not.exist');
  });

  it('Should update rubric', () => {
    cy.getByCy(`${mockRubricLevelOneName}`).click();
    cy.getByCy('rubric-name').clear().type(mockNewRubric);
    cy.getByCy('catalogue-name').clear().type(mockNewRubric);
    cy.selectOptionByTestId(`rubric-type`, MOCK_RUBRIC_TYPE_STAGE.name[0].value);
    cy.getByCy('rubric-submit').click();
    cy.getByCy('rubrics-tree').contains(mockNewRubric);
  });
});
