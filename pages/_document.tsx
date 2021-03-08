import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

function setInitialColorMode() {
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  function getInitialColorMode() {
    const preference = window.localStorage.getItem('theme');
    let hasPreference = typeof preference === 'string';
    /**
     * If the user has explicitly chosen light or dark,
     * use it. Otherwise, this value will be null.
     */

    if (hasPreference && preference) {
      return preference;
    }

    // If there is no saved preference, use a media query
    const mediaQuery = `(prefers-color-scheme: dark)`;
    const mql = window.matchMedia(mediaQuery);
    hasPreference = typeof mql.matches === 'boolean';

    if (hasPreference) {
      return mql.matches ? THEME_DARK : THEME_LIGHT;
    }

    // default to 'light'.
    return THEME_LIGHT;
  }

  const colorMode = getInitialColorMode();

  // add HTML attribute if dark mode
  document.documentElement.setAttribute('data-theme', colorMode);
}
// our function needs to be a string
const blockingSetInitialColorMode = `(function() {
        ${setInitialColorMode.toString()}
        setInitialColorMode();
})()
`;

// noinspection CheckTagEmptyBody
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
          ></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
