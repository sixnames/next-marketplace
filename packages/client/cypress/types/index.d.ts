declare namespace Cypress {
  interface MockGraphqlInterface {
    schema?: any;
    operations?: { [key: string]: any };
  }

  interface AttachFileOptionsInterface {
    subjectType?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    getByCy(testId: string): Chainable<Element>;
    shouldSuccess(): void;
    shouldError(): void;
    shouldNotError(): void;
    getBySelector(selector: string): Chainable<Element>;
    selectOptionByTestId(select: string, testId: string): Chainable<Element>;
    selectNthOption(select: string, nth: number): Chainable<Element>;
    createTestData(): void;
    clearTestData(): void;
    closeNotification(): void;
    visitMoreNavLink(testId: string): void;
    openMoreNav(): void;
    closeMoreNav(): void;
    attachFile(path: string, options?: AttachFileOptionsInterface): Chainable<Element>;
    testAuth(redirect?: string, email?: string, password?: string): Chainable<Element>;
  }
}