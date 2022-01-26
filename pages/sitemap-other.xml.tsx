import { GetServerSidePropsContext } from 'next';
import * as React from 'react';
import { getDomain } from 'tldts';
import {
  DEFAULT_CITY,
  DEFAULT_COMPANY_SLUG,
  DEFAULT_LOCALE,
  PAGE_STATE_PUBLISHED,
  ROUTE_BLOG,
  ROUTE_BLOG_POST,
  ROUTE_CONTACTS,
} from '../config/common';
import { COL_BLOG_POSTS, COL_COMPANIES, COL_CONFIGS } from '../db/collectionNames';
import { BlogPostModel, CompanyModel, ConfigModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { castConfigs, getConfigBooleanValue } from '../lib/configsUtils';

const SitemapXml: React.FC = () => {
  return <div />;
};

interface CreateSitemapInterface {
  host: string;
  slugs: string[];
}

const createSitemap = ({
  host,
  slugs,
}: CreateSitemapInterface) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://${host}${ROUTE_CONTACTS}</loc>
        </url>
        ${slugs
          .map((slug) => {
            return `
                    <url>
                        <loc>https://${host}${slug}</loc>
                    </url>
                `;
          })
          .join('')}
    </urlset>
    `;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res, req } = context;
  const initialSlugs: string[] = [];
  const { db } = await getDatabase();
  const configsCollection = db.collection<ConfigModel>(COL_CONFIGS);
  const blogPostsCollection = db.collection<BlogPostModel>(COL_BLOG_POSTS);
  const host = `${context.req.headers.host}`;
  const domain = getDomain(host, { validHosts: ['localhost'] });

  // Get site languages

  // Session company
  let company: CompanyModel | null | undefined = null;
  if (domain && process.env.DEFAULT_DOMAIN && domain !== process.env.DEFAULT_DOMAIN) {
    company = await db.collection<CompanyModel>(COL_COMPANIES).findOne({ domain });
  }
  const companySlug = company?.slug || DEFAULT_COMPANY_SLUG;

  // blog config
  const initialConfigs = await configsCollection
    .find({
      companySlug,
    })
    .toArray();

  const blogPosts = await blogPostsCollection
    .aggregate([
      {
        $match: {
          companySlug,
          state: PAGE_STATE_PUBLISHED,
        },
      },
      {
        $project: {
          slug: true,
        },
      },
    ])
    .toArray();

  // configs
  const configs = castConfigs({
    configs: initialConfigs,
    citySlug: DEFAULT_CITY,
    locale: DEFAULT_LOCALE,
  });

  // get blog slugs
  const showBlog = getConfigBooleanValue({ configs, slug: 'showBlog' });
  if (showBlog && blogPosts.length > 0) {
    const blogBasePath = `${ROUTE_BLOG}`;
    initialSlugs.push(blogBasePath);

    blogPosts.forEach(({ slug }) => {
      initialSlugs.push(`${ROUTE_BLOG_POST}/${slug}`);
    });
  }

  res.setHeader('Content-Type', 'text/xml');
  res.write(
    createSitemap({
      host: `${req.headers.host}`,
      slugs: initialSlugs,
    }),
  );
  res.end();
  return {
    props: {},
  };
}

export default SitemapXml;
