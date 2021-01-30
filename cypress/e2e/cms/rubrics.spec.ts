import { DEFAULT_LOCALE, GENDER_HE, GENDER_SHE, ROUTE_CMS, SECONDARY_LOCALE } from 'config/common';
import { CreateTestDataPayloadInterface } from 'tests/createTestData';

describe('Rubrics', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.testAuth(`${ROUTE_CMS}/rubrics`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should validate rubric creation', () => {
    const mockRubricLevelOneName = mockData.rubricLevelOneADefaultName;
    const mockRubricLevelTwoName = mockData.rubricLevelTwoADefaultName;
    const mockRubricVariantName = mockData.rubricVariantAlcohol.nameI18n[DEFAULT_LOCALE];

    // Should show validation errors on new rubric creation
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`create-rubric-modal`).should('exist');
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`nameI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`descriptionI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`shortDescriptionI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`catalogueTitle.defaultTitleI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`catalogueTitle.keywordI18n.${DEFAULT_LOCALE}-error`).should('exist');
    cy.getByCy(`catalogueTitle.gender-error`).should('exist');
    cy.getByCy(`variantId-error`).should('exist');

    // Shouldn't create a new rubric if exists on first level
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelOneName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelOneName);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelOneName);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelOneName);
    cy.selectOptionByTestId(`variantId`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.shouldError();

    // Shouldn't create a new rubric if exists on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelTwoName);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelTwoName);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelTwoName);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).type(mockRubricLevelTwoName);
    cy.selectOptionByTestId(`variantId`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`modal-tree-link-${mockRubricLevelOneName}`).click();
    cy.selectOptionByTestId(`variantId`, mockRubricVariantName);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`create-rubric-modal`).should('not.exist');
    cy.shouldError();
  });

  it('Should create new rubrics', () => {
    const mockRubricVariantName = mockData.rubricVariantAlcohol.nameI18n[DEFAULT_LOCALE];
    const mockNewRubricA = 'mockNewRubricA';
    const mockNewRubricB = 'mockNewRubricB';

    // Should create a new rubric on first level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).type(mockNewRubricA);
    cy.selectOptionByTestId(`variantId`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricA}`).should('exist');

    // Should create a new rubric on second level
    cy.getByCy(`create-rubric`).click();
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(mockNewRubricB);
    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).type(mockNewRubricB);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).type(mockNewRubricB);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).type(mockNewRubricB);
    cy.selectOptionByTestId(`variantId`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_SHE);
    cy.getByCy(`modal-tree-link-${mockNewRubricA}`).click();
    cy.getByCy(`rubric-submit`).click();
    cy.getByCy(`tree-link-${mockNewRubricB}`).should('exist');
  });

  it('Should display rubric details tab', () => {
    const mockRubricLevelOneName = mockData.rubricLevelOneADefaultName;
    const mockNewRubric = 'mockNewRubric';
    const mockRubricVariantName = mockData.rubricVariantJuice.nameI18n[DEFAULT_LOCALE];

    // Should have rubric details tab and should update rubric
    cy.getByCy(`tree-link-${mockRubricLevelOneName}`).click();
    cy.visitMoreNavLink('details');
    cy.getByCy(`nameI18n-accordion-${SECONDARY_LOCALE}`).click();

    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubric);
    cy.getByCy(`nameI18n-${SECONDARY_LOCALE}`).clear().type(mockNewRubric);

    cy.getByCy(`descriptionI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubric);
    cy.getByCy(`shortDescriptionI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubric);
    cy.getByCy(`catalogueTitle-defaultTitleI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubric);
    cy.getByCy(`catalogueTitle-prefixI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubric);
    cy.getByCy(`catalogueTitle-keywordI18n-${DEFAULT_LOCALE}`).clear().type(mockNewRubric);
    cy.selectOptionByTestId(`variantId`, mockRubricVariantName);
    cy.getByCy(`catalogueTitle-gender`).select(GENDER_HE);

    cy.getByCy('rubric-submit').click();
    cy.getByCy(`tree-link-${mockNewRubric}`).should('exist');
    cy.shouldSuccess();

    // Should delete rubric
    cy.getByCy(`rubric-delete`).click();
    cy.getByCy('delete-rubric-modal').should('exist');
    cy.getByCy('confirm').click();
    cy.shouldSuccess();
    cy.getByCy(`tree-link-${mockNewRubric}`).should('not.exist');
  });
});
