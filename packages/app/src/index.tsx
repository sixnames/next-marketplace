import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './components/App/App';
import './reset.css';
import { ThemeContextProvider } from './context/themeContext';
import { AppContextProvider } from './context/appContext';
import { NotificationsProvider } from './context/notificationsContext';
import { UserContextProvider } from './context/userContext';
import { API_URL } from './config';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: API_URL,
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
