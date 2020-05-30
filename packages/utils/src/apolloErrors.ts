interface ApolloErrorsInterface {
  graphQLErrors: [
    {
      message: string;
      extensions: {
        code: string;
        exception: {
          errors: { [key: string]: any };
        };
      };
    },
  ];
}

function apolloErrors(error: ApolloErrorsInterface) {
  let graphQLErrors = null;
  const fieldNames: string[] = [];
  if (error && error.graphQLErrors) {
    graphQLErrors = error.graphQLErrors.reduce((acc: string[], errorItem) => {
      const { extensions, message } = errorItem;
      if (extensions.code === 'UNAUTHENTICATED') {
        return [...acc, message];
      } else {
        const {
          exception: { errors },
        } = extensions;
        const itemStack = Object.keys(errors).map((key: string) => {
          fieldNames.push(key);
          return errors[key].message;
        });
        return [...acc, ...itemStack];
      }
    }, []);
  }

  return {
    graphQLErrors,
    fieldNames,
  };
}

export default apolloErrors;
