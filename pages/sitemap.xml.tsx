import { GetServerSidePropsContext } from 'next';
import * as React from 'react';

const SitemapXml: React.FC = () => {
  return <div />;
};

interface CreateSitemapInterface {
  host: string;
}

const createSitemap = ({ host }: CreateSitemapInterface) => `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <sitemap>
          <loc>https://${host}/sitemap-products.xml</loc>
       </sitemap>
       <sitemap>
          <loc>https://${host}/sitemap-categories.xml</loc>
       </sitemap>
       <sitemap>
          <loc>https://${host}/sitemap-other.xml</loc>
       </sitemap>
    </sitemapindex>
    `;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res, req } = context;
  res.setHeader('Content-Type', 'text/xml');
  res.write(
    createSitemap({
      host: `${req.headers.host}`,
    }),
  );
  res.end();
  return {
    props: {},
  };
}

export default SitemapXml;
