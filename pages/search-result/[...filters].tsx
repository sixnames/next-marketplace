import Catalogue, { CatalogueInterface } from 'components/Catalogue';
import { ROUTE_SEARCH_RESULT } from 'config/common';
import { getSearchServerSideProps } from 'lib/searchUtils';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';

const SearchResultPage: NextPage<CatalogueInterface> = ({ ...props }) => {
  return <Catalogue {...props} route={ROUTE_SEARCH_RESULT} />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CatalogueInterface>> {
  return getSearchServerSideProps(context);
}

export default SearchResultPage;
