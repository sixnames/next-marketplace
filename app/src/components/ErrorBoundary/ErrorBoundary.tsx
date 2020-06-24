import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryStateInterface {
  hasError: boolean;
  error?: Error | null;
  info?: ErrorInfo | null;
}

class ErrorBoundary extends Component<{}, ErrorBoundaryStateInterface> {
  constructor(props: {}) {
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
      return (
        <div
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 40,
            marginBottom: 40,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.25em',
          }}
        >
          <p>УПС! Что-то пошло не так.</p>
          <p>Лог ошибки отправлен разработчикам.</p>
          <p>Просим прощения за неудобства!</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
