import React from 'react';
import ErrorBoundaryFallback, {
  ErrorBoundaryFallbackInterface,
} from '../components/ErrorBoundary/ErrorBoundaryFallback';

function Error({ statusCode }: ErrorBoundaryFallbackInterface) {
  return <ErrorBoundaryFallback statusCode={statusCode} />;
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
