import { ASSETS_DIST } from 'config/common';
import { alwaysArray } from 'lib/arrayUtils';
import { getSharpImage } from 'lib/assetUtils/assetUtils';
import { noNaN } from 'lib/numbers';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import { AvailableFormatInfo, FormatEnum } from 'sharp';

const SitemapXml: React.FC = () => {
  return <div style={{ background: 'black', height: '100vh' }} />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  const { res, query } = context;
  // Extract the query-parameter
  const widthString = (query.width as string) || undefined;
  const format = (query.format || 'webp') as keyof FormatEnum | AvailableFormatInfo | undefined;
  const urlArray = [ASSETS_DIST, ...alwaysArray(query.url)];
  let filePath = urlArray.join('/');

  // Set the content-type of the response
  res.setHeader('Content-Type', `image/${format}`);

  console.log({
    filePath,
    format,
    width: noNaN(widthString),
  });

  // Get the processed image
  const file = await getSharpImage({
    filePath,
    format,
    width: noNaN(widthString),
  });

  if (file) {
    res.write(file);
    res.end();
    return {
      props: {},
    };
  }

  return {
    props: {},
    notFound: true,
  };
}

export default SitemapXml;
