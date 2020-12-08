import React, { Component, ErrorInfo } from 'react';
import { ObjectType } from '../../types';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

interface ErrorBoundaryStateInterface {
  hasError: boolean;
  error?: Error | null;
  info?: ErrorInfo | null;
}

class ErrorBoundary extends Component<ObjectType, ErrorBoundaryStateInterface> {
  constructor(props: ObjectType) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
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
