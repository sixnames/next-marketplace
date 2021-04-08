import { GetServerSidePropsContext } from 'next';
import * as React from 'react';

const SiteWebmanifest: React.FC = () => {
  return <div />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res } = context;
  res.setHeader('Content-Type', 'application/manifest+json');

  // TODO get company or site name
  res.write(
    `{
    "name": "Winepoint",
    "short_name": "Winepoint",
    "icons": [
        {
            "src": "/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
}`,
  );
  res.end();
  return {
    props: {},
  };
}

export default SiteWebmanifest;
