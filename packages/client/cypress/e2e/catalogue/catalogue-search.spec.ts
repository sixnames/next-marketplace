/// <reference types="cypress" />

import { getTestLangField } from '../../../utils/getLangField';

describe('Catalogue search', () => {
  let mockData: any;
  beforeEach(() => {
    cy.createTestData((mocks) => (mockData = mocks));
    cy.visit('/');
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should show search result', () => {
    const mockRubricLevelOneName = getTestLangField(mockData.rubricLevelOneA.name);
    cy.getByCy('search-trigger').click();
    cy.getByCy('search-dropdown').should('exist');
    cy.getByCy('search-rubric').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    cy.getByCy('search-product').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });

    cy.getByCy('search-input').type(mockRubricLevelOneName);
    cy.getByCy('search-rubric').should(($rubric) => {
      expect($rubric).to.have.length(1);
    });
    cy.getByCy('search-product').should(($rubric) => {
      expect($rubric).to.have.length(3);
    });
    cy.getByCy('search-close').click();
    cy.getByCy('search-dropdown').should('not.exist');
  });
});
