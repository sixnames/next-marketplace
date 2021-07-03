import Title from 'components/Title';
import { COL_SHOP_PRODUCTS, COL_SHOPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { ShopInterface, ShopProductInterface } from 'db/uiInterfaces';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from 'components/Inner';
import { getSiteInitialData } from 'lib/ssrUtils';

interface SearchResultConsumerInterface {
  search: string | null;
}

const SearchResultConsumer: React.FC<SearchResultConsumerInterface> = ({ search }) => {
  if (!search) {
    return (
      <Inner testId={'search-result-page'}>
        <Title>Запрос поиска пуст</Title>
      </Inner>
    );
  }

  return (
    <Inner testId={'search-result-page'}>
      <div>{search}</div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, cum, excepturi! Aliquam
      atque dignissimos maiores maxime nemo nesciunt nulla perferendis possimus praesentium, ratione
      reprehenderit sapiente unde vel! Deleniti non, similique.
    </Inner>
  );
};

interface SearchResultPageInterface
  extends SiteLayoutProviderInterface,
    SearchResultConsumerInterface {}

const SearchResultPage: NextPage<SearchResultPageInterface> = ({ search, ...props }) => {
  return (
    <SiteLayoutProvider {...props}>
      <SearchResultConsumer search={search} />
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<SearchResultPageInterface>> {
  const { db } = await getDatabase();
  const { query } = context;
  const search = query.search ? `${query.search}` : null;

  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);
  const shopsCollection = db.collection<ShopInterface>(COL_SHOPS);
  const { props } = await getSiteInitialData({
    context,
  });

  console.log({
    shopProductsCollection,
    shopsCollection,
  });

  return {
    props: {
      ...props,
      search,
    },
  };
}

export default SearchResultPage;
