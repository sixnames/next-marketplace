import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './components/App/App';
import './reset.css';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
