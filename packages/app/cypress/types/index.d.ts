declare namespace Cypress {
  interface MockGraphqlInterface {
    schema: any;
    operations: { [key: string]: any };
  }

  interface AttachFileOptionsInterface {
    subjectType?: string;
  }

  interface AuthInterface {
    email: string;
    password: string;
    redirect: string;
  }

  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    mockGraphql(args: MockGraphqlInterface): Chainable<Element>;
    getByCy(testId: string): Chainable<Element>;
    selectOptionByTestId(select: string, testId: string): Chainable<Element>;
    selectNthOption(select: string, nth: number): Chainable<Element>;
    createTestData(): void;
    clearTestData(): void;
    visitMoreNavLink(testId: string): void;
    openMoreNav(): void;
    closeMoreNav(): void;
    attachFile(path: string, options?: AttachFileOptionsInterface): Chainable<Element>;
    auth(args: AuthInterface): void;
  }
}
