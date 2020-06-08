import schema from '../../../src/generated/introspectionSchema.json';
import {
  ME_AS_ADMIN,
  MOCK_ATTRIBUTE_MULTIPLE,
  MOCK_ATTRIBUTES_GROUP,
  MOCK_ATTRIBUTES_GROUP_FOR_DELETE,
} from '@rg/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';
const mockGroupName = MOCK_ATTRIBUTES_GROUP.name[0].value;
const mockAttributeName = MOCK_ATTRIBUTE_MULTIPLE.name[0].value;
const mockGroupForDeleteName = MOCK_ATTRIBUTES_GROUP_FOR_DELETE.name[0].value;
const mockAttributeNewName = 'cy-test-new-attribute';

describe('Attributes Groups', () => {
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
    cy.visit(`/attributes-groups?${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should create a new attributes group', () => {
    const groupName = 'cy-test-new-group';

    cy.getByCy(`create-attributes-group`).click();
    cy.getByCy(`create-attributes-group-modal`).should('exist');

    cy.getByCy(`update-name-input`).type(groupName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`group-${groupName}`).should('exist');
  });

  it('Should show validation error on not valid attributes group name', () => {
    const groupName = 'f';
    cy.getByCy(`create-attributes-group`).click();
    cy.getByCy(`create-attributes-group-modal`).should('exist');

    cy.getByCy(`update-name-input`).type(groupName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`name-error`);
  });

  it('Should update group title on groups filter click', () => {
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`group-title`).contains(mockGroupName).should('exist');
  });

  it('Should update attributes group', () => {
    const groupNewName = 'cy-test-new-group';
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-update`).click();
    cy.getByCy(`update-name-input`).should('have.value', mockGroupName).clear().type(groupNewName);
    cy.getByCy(`update-name-submit`).click();
    cy.contains(groupNewName).should('exist');
  });

  it('Should show validation error on not valid attributes group update', () => {
    const groupNewName = 'f';
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-update`).click();
    cy.getByCy(`update-name-input`).should('have.value', mockGroupName).clear().type(groupNewName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`name-error`);
  });

  it(`Shouldn't delete attributes group connected to the rubric`, () => {
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-delete`).click();
    cy.getByCy(`delete-attributes-group`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.contains(mockGroupName).should('exist');
    cy.getByCy(`group-${mockGroupName}`).should('exist');
  });

  it('Should delete attributes group', () => {
    cy.getByCy(`group-${mockGroupForDeleteName}`).click();
    cy.getByCy(`attributes-group-delete`).click();
    cy.getByCy(`delete-attributes-group`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.contains(mockGroupForDeleteName).should('not.exist');
    cy.getByCy(`group-${mockGroupForDeleteName}`).should('not.exist');
  });

  it(`Shouldn't create attribute in group on validation error`, () => {
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-create`).click();

    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`name-error`).should('exist');
    cy.getByCy(`type-error`).should('exist');

    cy.getByCy(`attribute-type`).select('multipleSelect');
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`options-error`).should('exist');
  });

  it('Should create attribute in group', () => {
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`attributes-group-create`).click();

    cy.getByCy(`attribute-name`).type(mockAttributeNewName);
    cy.getByCy(`attribute-type`).select('multipleSelect');
    cy.selectNthOption(`[data-cy=attribute-options]`, 2);
    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeNewName}`).should('exist');
  });

  it('Should update attribute in group', () => {
    const attributeNewName = 'cy-test-new-attribute';

    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`${mockAttributeName}-attribute-update`).click();

    cy.getByCy(`attribute-name`)
      .should('have.value', mockAttributeName)
      .clear()
      .type(attributeNewName);
    cy.getByCy(`attribute-type`).select('string');
    cy.selectNthOption(`[data-cy=attribute-metrics]`, 3);

    cy.getByCy(`attribute-submit`).click();
    cy.getByCy(`${mockAttributeName}`).should('not.exist');
    cy.getByCy(`${attributeNewName}`).should('exist');
  });

  it('Should delete attribute from group', () => {
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`${mockAttributeName}-attribute-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${mockAttributeName}`).should('not.exist');
  });
});
