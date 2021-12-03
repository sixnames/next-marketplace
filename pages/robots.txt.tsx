import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext } from 'next';
import * as React from 'react';

const RobotsTxt: React.FC = () => {
  return <div />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res, req } = context;
  const host = `${req.headers.host}`;
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props) {
    return {
      notFound: true,
    };
  }

  const robotsConfig = props.initialData.configs.robotsTxt.join('\n');
  const siteUrl = `https://${host}`;
  res.setHeader('Content-Type', 'text/plain');
  res.write(
    `User-agent:*
Disallow: /api/*
Disallow: /console/*
Disallow: /cms/*
Disallow: /profile/*
Disallow: /cart
Disallow: /make-an-order
Disallow: /thank-you
${robotsConfig}
Sitemap: ${siteUrl}/sitemap.xml
    `,
  );
  res.end();
  return {
    props: {},
  };
}

export default RobotsTxt;
