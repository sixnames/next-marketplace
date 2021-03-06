import Document, { Head, Html, Main, NextScript } from 'next/document';
import * as React from 'react';

function setInitialColorMode() {
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  function getInitialColorMode() {
    const preference = window.localStorage.getItem('theme');
    /**
     * If the user has explicitly chosen light or dark,
     * use it. Otherwise, this value will be null.
     */

    if (preference) {
      return preference;
    }

    // If there is no saved preference, use a media query
    const mediaQuery = `(prefers-color-scheme: dark)`;
    const mql = window.matchMedia(mediaQuery);

    if (mql.matches) {
      return THEME_DARK;
    }

    // default to 'light'.
    return THEME_LIGHT;
  }

  const colorMode = getInitialColorMode();

  window.localStorage.setItem('theme', colorMode);

  // add HTML attributes if dark mode
  document.documentElement.setAttribute('data-theme', colorMode);

  if (colorMode === THEME_DARK) {
    document.documentElement.classList.remove(THEME_LIGHT);
    document.documentElement.classList.add(THEME_DARK);
  } else {
    document.documentElement.classList.remove(THEME_DARK);
    document.documentElement.classList.add(THEME_LIGHT);
  }
}

// our function needs to be a string
const blockingSetInitialColorMode = `(function() {
        ${setInitialColorMode.toString()}
        setInitialColorMode();
})()
`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head title={''} />
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: blockingSetInitialColorMode,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
