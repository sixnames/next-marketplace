import * as React from 'react';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import { ObjectType } from 'types/clientTypes';

interface ErrorBoundaryStateInterface {
  hasError: boolean;
  error?: Error | null;
  info?: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ObjectType, ErrorBoundaryStateInterface> {
  constructor(props: ObjectType) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({
      hasError: true,
      error: error,
      info: info,
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
