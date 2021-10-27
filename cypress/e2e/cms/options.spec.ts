import { DEFAULT_LOCALE, GENDER_HE, GENDER_IT, GENDER_SHE, ROUTE_CMS } from 'config/common';

describe('Options', () => {
  beforeEach(() => {
    cy.testAuth(`${ROUTE_CMS}/options`);
  });

  it('Should CRUD option in group', () => {
    const optionName = 'optionName';
    const childOptionName = 'childOptionName';
    const optionNewName = 'optionNewName';
    const optionNewColor = '#ff0000';

    // Should create top level option
    cy.getByCy(`Регион-update`).click();
    cy.wait(1500);
    cy.getByCy(`create-top-level-option`).click();
    cy.getByCy(`option-in-group-modal`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(optionName);
    cy.getByCy(`option-gender`).select(GENDER_IT);
    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LOCALE}`).type(optionName);
    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LOCALE}`).type(optionName);
    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LOCALE}`).type(optionName);
    cy.getByCy(`option-submit`).click();
    cy.wait(1500);
    cy.getByCy(`option-${optionName}`).should('exist');

    // Should create second level option
    cy.getByCy(`${optionName}-create`).click();
    cy.getByCy(`option-in-group-modal`).should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(childOptionName);
    cy.getByCy(`option-gender`).select(GENDER_IT);
    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LOCALE}`).type(childOptionName);
    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LOCALE}`).type(childOptionName);
    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LOCALE}`).type(childOptionName);
    cy.getByCy(`option-submit`).click();
    cy.wait(1500);
    cy.getByCy(`option-${childOptionName}`).should('exist');

    // Should delete top level option and option children
    cy.getByCy(`${optionName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`option-${optionName}`).should('not.exist');
    cy.getByCy(`option-${childOptionName}`).should('not.exist');

    // Should update option
    cy.visit(`${ROUTE_CMS}/options`);
    cy.getByCy(`Тип вина-update`).click();
    cy.wait(1500);
    cy.getByCy(`Крепленое-option`).click();
    cy.get('[data-cy="Крепленое-option"]')
      .first()
      .then((el: any) => {
        cy.visit(`${ROUTE_CMS}/options/${el.data('group-id')}/options/${el.data('id')}`);
      });
    cy.wait(1500);
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    cy.getByCy(`option-color`).invoke('val', optionNewColor).trigger('change');
    cy.getByCy(`option-gender`).select(GENDER_SHE);
    cy.getByCy(`variant-${GENDER_SHE}-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    cy.getByCy(`variant-${GENDER_HE}-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    cy.getByCy(`variant-${GENDER_IT}-${DEFAULT_LOCALE}`).clear().type(optionNewName);
    cy.getByCy(`option-submit`).click();
  });
});
