import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './components/App/App';
import './reset.css';
import { ThemeContextProvider } from './context/themeContext';
import { AppContextProvider } from './context/appContext';
import { NotificationsProvider } from './context/notificationsContext';
import { UserContextProvider } from './context/userContext';
import { API_URL } from './config';

const link = createHttpLink({
  uri: API_URL,
  credentials: 'include',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

ReactDOM.render(
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
  </ThemeContextProvider>,
  document.getElementById('root'),
);
