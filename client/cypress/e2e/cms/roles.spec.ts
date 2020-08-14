import { QUERY_DATA_LAYOUT_FILTER_ENABLED } from '../../../config';

describe('User roles', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.testAuth(`/app/cms/roles${QUERY_DATA_LAYOUT_FILTER_ENABLED}`);
  });

  after(() => {
    cy.clearTestData();
  });

  it('Should CRUD user roles', () => {
    // Shouldn't create role on validation error
  });
});
