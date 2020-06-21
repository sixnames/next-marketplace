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

const mockAttributesGroup = MOCK_ATTRIBUTES_GROUP.name[0].value;
const mockAttributesGroupForDelete = MOCK_ATTRIBUTES_GROUP_FOR_DELETE.name[0].value;

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
    cy.visit(`/rubrics${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD rubric attributes list', () => {
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');

    // Should delete attributes group from list
    cy.getByCy(`${mockAttributesGroup}-delete`).click();
    cy.getByCy(`attributes-group-delete-modal`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${mockAttributesGroup}-delete`).should('not.exist');
    cy.closeNotification();

    // Shouldn't contain deleted attribute group on first and second levels
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroup}-delete`).should('not.exist');
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockAttributesGroup}-delete`).should('not.exist');

    // Should show validation error on add attributes group to the list
    cy.getByCy(`tree-link-${mockRubricLevelTwoName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy(`${mockRubricLevelTwoName}-create`).click();
    cy.getByCy(`add-attributes-group-to-rubric-modal`).should('exist');
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('attributesGroupId-error').should('exist');

    // Should add attributes group to the list
    cy.selectOptionByTestId('attributes-groups', mockAttributesGroupForDelete);
    cy.getByCy(`attributes-group-submit`).click();
    cy.getByCy('rubric-attributes').should('contain', mockAttributesGroupForDelete);
    cy.closeNotification();

    // Should have new attribute group on first and third levels
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy('rubric-attributes').should('contain', mockAttributesGroupForDelete);
    cy.getByCy(`tree-link-${mockRubricLevelThreeName}`).click();
    cy.visitMoreNavLink('attributes');
    cy.getByCy('rubric-attributes').should('contain', mockAttributesGroupForDelete);
  });
});
