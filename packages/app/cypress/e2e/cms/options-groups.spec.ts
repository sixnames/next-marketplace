import schema from '../../../src/generated/introspectionSchema.json';
import {
  ME_AS_ADMIN,
  MOCK_OPTIONS,
  MOCK_OPTIONS_GROUP,
  MOCK_OPTIONS_GROUP_FOR_DELETE,
} from '@rg/config';
import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../src/config';

const mockGroupName = MOCK_OPTIONS_GROUP.name[0].value;
const mockOptionName = MOCK_OPTIONS[0].name[0].value;
const mockOptionColor = MOCK_OPTIONS[0].color;
const mockGroupForDeleteName = MOCK_OPTIONS_GROUP_FOR_DELETE.name[0].value;

describe('Options Groups', () => {
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
    cy.visit(`/options-groups?${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should create a new options group', () => {
    const groupName = 'cy-test-new-group';

    // Create group
    cy.getByCy(`create-options-group`).click();
    cy.getByCy(`create-options-group-modal`).should('exist');

    cy.getByCy(`update-name-input`).type(groupName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`create-options-group-modal`).should('not.exist');

    // Created group in filter list
    cy.getByCy(`group-${groupName}`).should('exist');
  });

  it('Should show validation error on not valid options group name', () => {
    const groupName = 'f';
    cy.getByCy(`create-options-group`).click();
    cy.getByCy(`create-options-group-modal`).should('exist');

    cy.getByCy(`update-name-input`).type(groupName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`name-error`);
  });

  it('Should update group title on groups filter click', () => {
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`group-title`).contains(mockGroupName).should('exist');
  });

  it('Should update options group', () => {
    const groupNewName = 'cy-test-new-name';
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`options-group-update`).click();
    cy.getByCy(`update-name-input`).should('have.value', mockGroupName).clear().type(groupNewName);
    cy.getByCy(`update-name-submit`).click();
    cy.contains(groupNewName).should('exist');
  });

  it('Should show validation error on not valid options group update', () => {
    const groupNewName = 'f';
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`options-group-update`).click();
    cy.getByCy(`update-name-input`).should('have.value', mockGroupName).clear().type(groupNewName);
    cy.getByCy(`update-name-submit`).click();
    cy.getByCy(`name-error`);
  });

  it(`Shouldn't delete options group connected to the attribute`, () => {
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`options-group-delete`).click();
    cy.getByCy(`delete-options-group`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.contains(mockGroupName).should('exist');
    cy.getByCy(`group-${mockGroupName}`).should('exist');
  });

  it('Should delete options group', () => {
    cy.getByCy(`group-${mockGroupForDeleteName}`).click();
    cy.getByCy(`options-group-delete`).click();
    cy.getByCy(`delete-options-group`).should('exist');
    cy.getByCy(`confirm`).click();
    cy.contains(mockGroupForDeleteName).should('not.exist');
    cy.getByCy(`group-${mockGroupForDeleteName}`).should('not.exist');
  });

  it(`Shouldn't create option in group on validation error`, () => {
    const optionName = 'f';
    const optionColor = 'b';

    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`options-group-create`).click();

    cy.getByCy(`option-name`).type(optionName);
    cy.getByCy(`option-color`).type(optionColor);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`name-error`).should('exist');
    cy.getByCy(`color-error`).should('exist');
  });

  it(`Shouldn't create option in group if there is an option with the same name`, () => {
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`options-group-create`).click();

    cy.getByCy(`option-name`).type(mockOptionName);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${mockOptionName}`).should('have.length', 1);
  });

  it('Should create option in group', () => {
    const optionName = 'cy-test-option';
    const optionColor = '333333';

    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`options-group-create`).click();

    cy.getByCy(`option-name`).type(optionName);
    cy.getByCy(`option-color`).type(optionColor);
    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${optionName}`).should('exist');
  });

  it('Should update option in group', () => {
    const optionNewName = 'cy-test-option';
    const optionNewColor = 'fafafa';

    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`${mockOptionName}-option-update`).click();

    cy.getByCy(`option-name`).should('have.value', mockOptionName).clear().type(optionNewName);

    cy.getByCy(`option-color`).should('have.value', mockOptionColor).clear().type(optionNewColor);

    cy.getByCy(`option-submit`).click();
    cy.getByCy(`${mockOptionName}`).should('not.exist');
    cy.getByCy(`${optionNewName}`).should('exist');
  });

  it(`Shouldn't update option in group on validation error`, () => {
    const optionNewName = 'f';
    const optionNewColor = 'b';

    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`${mockOptionName}-option-update`).click();

    cy.getByCy(`option-name`).should('have.value', mockOptionName).clear().type(optionNewName);

    cy.getByCy(`option-color`).should('have.value', mockOptionColor).clear().type(optionNewColor);

    cy.getByCy(`option-submit`).click();
    cy.getByCy(`name-error`).should('exist');
    cy.getByCy(`color-error`).should('exist');
  });

  it('Should delete option from group', () => {
    cy.getByCy(`group-${mockGroupName}`).click();
    cy.getByCy(`${mockOptionName}-option-delete`).click();
    cy.getByCy(`confirm`).click();
    cy.getByCy(`${mockOptionName}`).should('not.exist');
  });
});
