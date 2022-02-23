import { useLocaleContext } from 'components/context/localeContext';
import WpBreadcrumbs from 'components/WpBreadcrumbs';
import { BreadcrumbsItemInterface } from 'db/uiInterfaces';
import { DEFAULT_LOCALE } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { LinkPropsInterface } from 'lib/links/getProjectLinks';
import { getBasePath } from 'lib/links/linkUtils';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import * as React from 'react';

const pathNames = {
  'event-rubrics': { [DEFAULT_LOCALE]: '' },
  'gift-certificates': { [DEFAULT_LOCALE]: '' },
  'my-tasks': { [DEFAULT_LOCALE]: '' },
  'order-statuses': { [DEFAULT_LOCALE]: '' },
  'page-templates': { [DEFAULT_LOCALE]: '' },
  'rubric-variants': { [DEFAULT_LOCALE]: '' },
  'search-result': { [DEFAULT_LOCALE]: '' },
  'seo-content': { [DEFAULT_LOCALE]: '' },
  'shop-orders': { [DEFAULT_LOCALE]: '' },
  'sign-in': { [DEFAULT_LOCALE]: '' },
  'sync-errors': { [DEFAULT_LOCALE]: '' },
  'task-variants': { [DEFAULT_LOCALE]: '' },
  'thank-you': { [DEFAULT_LOCALE]: '' },
  'user-categories': { [DEFAULT_LOCALE]: '' },
  add: { [DEFAULT_LOCALE]: '' },
  analytics: { [DEFAULT_LOCALE]: '' },
  assets: { [DEFAULT_LOCALE]: '' },
  attributes: { [DEFAULT_LOCALE]: '' },
  blog: { [DEFAULT_LOCALE]: '' },
  brand: { [DEFAULT_LOCALE]: '' },
  brands: { [DEFAULT_LOCALE]: '' },
  cart: { [DEFAULT_LOCALE]: '' },
  catalogue: { [DEFAULT_LOCALE]: '' },
  categories: { [DEFAULT_LOCALE]: '' },
  certificate: { [DEFAULT_LOCALE]: '' },
  cms: { [DEFAULT_LOCALE]: '' },
  code: { [DEFAULT_LOCALE]: '' },
  collections: { [DEFAULT_LOCALE]: '' },
  companies: { [DEFAULT_LOCALE]: '' },
  config: { [DEFAULT_LOCALE]: '' },
  console: { [DEFAULT_LOCALE]: '' },
  contacts: { [DEFAULT_LOCALE]: '' },
  create: { [DEFAULT_LOCALE]: '' },
  details: { [DEFAULT_LOCALE]: '' },
  docs: { [DEFAULT_LOCALE]: '' },
  editor: { [DEFAULT_LOCALE]: '' },
  event: { [DEFAULT_LOCALE]: '' },
  events: { [DEFAULT_LOCALE]: '' },
  index: { [DEFAULT_LOCALE]: '' },
  languages: { [DEFAULT_LOCALE]: '' },
  manufacturers: { [DEFAULT_LOCALE]: '' },
  metrics: { [DEFAULT_LOCALE]: '' },
  nav: { [DEFAULT_LOCALE]: '' },
  notifications: { [DEFAULT_LOCALE]: '' },
  options: { [DEFAULT_LOCALE]: '' },
  order: { [DEFAULT_LOCALE]: '' },
  orders: { [DEFAULT_LOCALE]: '' },
  pages: { [DEFAULT_LOCALE]: '' },
  password: { [DEFAULT_LOCALE]: '' },
  post: { [DEFAULT_LOCALE]: '' },
  product: { [DEFAULT_LOCALE]: '' },
  products: { [DEFAULT_LOCALE]: '' },
  profile: { [DEFAULT_LOCALE]: '' },
  project: { [DEFAULT_LOCALE]: '' },
  promo: { [DEFAULT_LOCALE]: '' },
  roles: { [DEFAULT_LOCALE]: '' },
  rubrics: { [DEFAULT_LOCALE]: '' },
  rules: { [DEFAULT_LOCALE]: '' },
  seo: { [DEFAULT_LOCALE]: '' },
  shop: { [DEFAULT_LOCALE]: '' },
  shops: { [DEFAULT_LOCALE]: '' },
  suppliers: { [DEFAULT_LOCALE]: '' },
  tasks: { [DEFAULT_LOCALE]: '' },
  ui: { [DEFAULT_LOCALE]: '' },
  user: { [DEFAULT_LOCALE]: '' },
  users: { [DEFAULT_LOCALE]: '' },
  variants: { [DEFAULT_LOCALE]: '' },
};

export interface ConsoleBreadcrumbsConfigItemInterface {
  breakpoint: keyof LinkPropsInterface;
  name: string;
}

export interface ConsoleBreadcrumbsConfigNamelessItemInterface {
  breakpoint: keyof typeof pathNames;
  name?: undefined | null;
}

export type ConsoleBreadcrumbsConfig = (
  | ConsoleBreadcrumbsConfigItemInterface
  | ConsoleBreadcrumbsConfigNamelessItemInterface
)[];

export interface ConsoleBreadcrumbsInterface {
  config?: ConsoleBreadcrumbsConfig;
  currentPageName?: string;
}

export const ConsoleBreadcrumbs: React.FC<ConsoleBreadcrumbsInterface> = ({
  config,
  currentPageName,
}) => {
  const { locale } = useLocaleContext();
  const { asPath, query } = useRouter();
  if (!config || config.length < 1) {
    return null;
  }

  const breadcrumbsConfig: BreadcrumbsItemInterface[] = [];
  config.forEach((configItem) => {
    const basePath = getBasePath({
      breakpoint: configItem.breakpoint,
      query,
      asPath,
    });

    let name = configItem.name;
    if (!name) {
      const translation = get(pathNames, configItem.breakpoint);
      name = getFieldStringLocale(translation, locale);
    }

    if (name) {
      breadcrumbsConfig.push({
        name,
        href: basePath,
      });
    }
  });

  return (
    <WpBreadcrumbs
      currentPageName={currentPageName}
      config={breadcrumbsConfig}
      noMainPage={true}
      lowWrapper={true}
      lowBottom={true}
    />
  );
};
