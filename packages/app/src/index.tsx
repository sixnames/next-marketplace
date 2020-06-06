import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './components/App/App';
import './reset.css';
import { ThemeContextProvider } from './context/themeContext';
import { AppContextProvider } from './context/appContext';
import { NotificationsProvider } from './context/notificationsContext';
import { UserContextProvider } from './context/userContext';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost/api/graphql',
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <ApolloProvider client={client}>
        <AppContextProvider>
          <UserContextProvider>
            <NotificationsProvider>
              <App />
            </NotificationsProvider>
          </UserContextProvider>
        </AppContextProvider>
      </ApolloProvider>
    </ThemeContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
