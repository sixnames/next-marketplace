declare namespace Cypress {
  interface AttachFileOptionsInterface {
    subjectType?: string;
  }

  interface MakeAnOrderInterface {
    callback?: () => void;
    orderFields?: {
      customerName: string;
      customerPhone: string;
      customerEmail: string;
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    getByCy(testId: string): Chainable<Element>;
    shouldSuccess(log?: string): void;
    shouldError(log?: string): void;
    shouldNotError(): void;
    getBySelector(selector: string): Chainable<Element>;
    selectOptionByTestId(select: string, testId: string): Chainable<Element>;
    selectNthOption(select: string, nth: number): Chainable<Element>;
    createTestData(): void;
    closeNotification(): void;
    attachFile(path: string, options?: AttachFileOptionsInterface): Chainable<Element>;
    testAuth(redirect?: string, email?: string, password?: string): Chainable<Element>;
    signOut(redirect?: string): Chainable<Element>;
    makeAnOrder(props: MakeAnOrderInterface): Chainable<Element>;
  }
}
