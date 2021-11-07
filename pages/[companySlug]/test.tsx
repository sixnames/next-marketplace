import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { CompanyModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { castDbData } from 'lib/ssrUtils';
import * as React from 'react';
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  NextPage,
} from 'next';

interface TestInterface {
  company: CompanyModel;
  companies: CompanyModel[];
}

const Test: NextPage<TestInterface> = ({ company, companies }) => {
  return (
    <Inner>
      <div className='text-xl mb-8'>{company ? company.name : 'Default'}</div>
      <div className='flex flex-col gap-4'>
        <div>
          <Link prefetch={false} href={`/${DEFAULT_COMPANY_SLUG}/test`}>
            Default
          </Link>
        </div>
        {companies.map((company) => {
          return (
            <div key={`${company._id}`}>
              <Link prefetch={false} href={`/${company.slug}/test`}>
                {company.name}
              </Link>
            </div>
          );
        })}
      </div>
    </Inner>
  );
};

export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult> {
  console.log('Paths ', context);
  const paths: any[] = [];
  return {
    paths,
    fallback: 'blocking',
  };
}

type ParamsInterface = {
  companySlug: string;
};

export async function getStaticProps(
  context: GetStaticPropsContext<ParamsInterface>,
): Promise<GetStaticPropsResult<TestInterface>> {
  console.log('Props ', context);
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyModel>(COL_COMPANIES);
  const companies = await companiesCollection.find({}).toArray();

  let company: CompanyModel | null | undefined = null;
  if (context.params?.companySlug !== DEFAULT_COMPANY_SLUG) {
    company = companies.find(({ slug }) => {
      return slug === context.params?.companySlug;
    });
  }

  return {
    props: {
      companies: castDbData(companies),
      company: castDbData(company),
    },
    revalidate: 5,
  };
}

export default Test;
