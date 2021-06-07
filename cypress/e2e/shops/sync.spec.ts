/// <reference types="cypress" />
/// <reference path="../../types/index.d.ts" />

import { ADULT_KEY, ADULT_TRUE } from 'config/common';

export {};

const body = [
  {
    test: 1,
  },
  {
    test: 2,
  },
];

describe('Authorization', () => {
  beforeEach(() => {
    cy.createTestData();
    cy.setLocalStorage(ADULT_KEY, ADULT_TRUE);
    cy.visit(`/`);
  });

  it('Should sync shop products with site db', () => {
    cy.request({
      method: 'POST',
      url: `/api/shops/sync?token=1234&apiVersion=0.0.1&systemVersion=8.2`,
      body: JSON.stringify(body),
    }).then((res) => {
      console.log(res.body);
    });
  });
});
