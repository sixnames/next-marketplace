import { DEFAULT_LOCALE } from 'config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

describe('Metrics', () => {
  const links = getProjectLinks();
  beforeEach(() => {
    cy.testAuth(links.cms.metrics.url);
  });

  it(`Should CRUD metrics`, () => {
    const newMetricName = 'newMetricName';
    const updatedMetricName = 'updatedMetricName';

    // should create metric
    cy.getByCy('metrics-list').should('exist');
    cy.getByCy('create-metric').click();
    cy.getByCy('metric-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).type(newMetricName);
    cy.getByCy('submit-metric').click();
    cy.wait(1500);
    cy.getByCy(`${newMetricName}-row`).should('exist');

    // should update metric
    cy.getByCy(`${newMetricName}-update`).click();
    cy.getByCy('metric-modal').should('exist');
    cy.getByCy(`nameI18n-${DEFAULT_LOCALE}`).clear().type(updatedMetricName);
    cy.getByCy('submit-metric').click();

    // should delete metric
    cy.getByCy(`${updatedMetricName}-delete`).click();
    cy.getByCy('confirm').click();
    cy.wait(1500);
    cy.getByCy(`${updatedMetricName}-row`).should('not.exist');
  });
});
