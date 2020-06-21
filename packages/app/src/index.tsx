import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { createUploadLink } from 'apollo-upload-client';
import { ThemeContextProvider } from './context/themeContext';
import { AppContextProvider } from './context/appContext';
import { NotificationsProvider } from './context/notificationsContext';
import { UserContextProvider } from './context/userContext';
import { API_PATH } from './config';
import App from './components/App/App';
import './reset.css';

const link = createUploadLink({
  uri: API_PATH,
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
