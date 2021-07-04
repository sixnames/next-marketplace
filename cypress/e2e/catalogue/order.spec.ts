describe('Make an order', () => {
  beforeEach(() => {
    cy.visit(`/`);
  });

  it('Should make an order', () => {
    cy.makeAnOrder({
      orderFields: {
        customerEmail: 'email@mail.com',
        customerPhone: '71233211234',
        customerName: 'name',
      },
    });
  });
});
