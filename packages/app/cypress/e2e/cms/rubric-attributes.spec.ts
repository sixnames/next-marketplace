import schema from '../../../src/generated/introspectionSchema.json';
import {
  ME_AS_ADMIN,
  MOCK_ATTRIBUTES_GROUP,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
  MOCK_RUBRIC_LEVEL_ONE,
  MOCK_RUBRIC_LEVEL_THREE,
  MOCK_RUBRIC_LEVEL_TWO,
} from '@rg/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';

const mockRubricLevelOneName = MOCK_RUBRIC_LEVEL_ONE.name[0].value;
const mockRubricLevelTwoName = MOCK_RUBRIC_LEVEL_TWO.name[0].value;
const mockRubricLevelThreeName = MOCK_RUBRIC_LEVEL_THREE.name[0].value;

describe('Rubric attributes', () => {
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

  it('Should have attributes list', () => {
    cy.getByCy(`${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy('rubric-attributes').should('exist');
  });

  it('Should delete attributes group from list', () => {
    cy.getByCy(`${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${MOCK_ATTRIBUTES_GROUP.name}-delete`).click();
    cy.getByCy(`attributes-group-delete-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${MOCK_ATTRIBUTES_GROUP.name}-delete`).should('not.exist');

    // Should contain deleted attribute group on first level
    cy.getByCy(`${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${MOCK_ATTRIBUTES_GROUP.name}-delete`).should('not.exist');

    // Should contain deleted attribute group on third level
    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${MOCK_ATTRIBUTES_GROUP.name}-delete`).should('not.exist');
  });

  it('Should show validation error on add attributes group to the list', () => {
    cy.getByCy(`${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockRubricLevelTwoName}-create`).click();
    cy.getByCy(`add-attributes-group-to-rubric-modal`).should('exist');
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('attributesGroupId-error').should('exist');
  });

  it('Should add attributes group to the list', () => {
    cy.getByCy(`${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockRubricLevelTwoName}-create`).click();
    cy.getByCy(`add-attributes-group-to-rubric-modal`).should('exist');
    cy.selectOptionByTestId('attributes-groups', MOCK_ATTRIBUTES_GROUP_FOR_DELETE.name[0].value);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy(`add-attributes-group-to-rubric-modal`).should('not.exist');
    cy.getByCy('rubric-attributes').should('contain', MOCK_ATTRIBUTES_GROUP_FOR_DELETE.name);

    // Should have new attribute group on first level
    cy.getByCy(`${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy('rubric-attributes').should('contain', MOCK_ATTRIBUTES_GROUP_FOR_DELETE.name);

    // Should have new attribute group on third level
    cy.getByCy(`${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy('rubric-attributes').should('contain', MOCK_ATTRIBUTES_GROUP_FOR_DELETE.name);
  });
});
