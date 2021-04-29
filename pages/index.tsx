import { useConfigContext } from 'context/configContext';
import fs from 'fs';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import path from 'path';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Title from 'components/Title/Title';
import Inner from 'components/Inner/Inner';
import { getSiteInitialData } from 'lib/ssrUtils';

const Home: NextPage<SiteLayoutProviderInterface> = (props) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configTitle = getSiteConfigSingleValue('pageDefaultTitle');

  return (
    <SiteLayoutProvider {...props}>
      <Inner>
        <Title>{configTitle}</Title>
      </Inner>
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<SiteLayoutProviderInterface>> {
  // TODO test
  console.log(' ');
  const postsDirectory = path.join(process.cwd(), 'posts');
  console.log('postsDirectory ', postsDirectory);

  const filenames = fs.readdirSync(postsDirectory);
  console.log('filenames ', filenames);

  const posts = filenames.map(async (filename: string) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = await fs.readFileSync(filePath, 'utf8');
    return {
      filename,
      content: fileContents,
    };
  });
  console.log(JSON.stringify(await Promise.all(posts), null, 2));
  console.log(' ');
  // TODO test

  const { props } = await getSiteInitialData({
    context,
  });

  return {
    props,
  };
}

export default Home;
