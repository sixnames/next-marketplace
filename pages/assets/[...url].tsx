import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import path from 'path';
import fs from 'fs';
import * as React from 'react';
import { AvailableFormatInfo, FormatEnum } from 'sharp';
import { ASSETS_DIST, DEFAULT_COMPANY_SLUG, IMAGE_FALLBACK, ONE_WEEK } from '../../config/common';
import { alwaysArray, alwaysString } from '../../lib/arrayUtils';
import { checkIfWatermarkNeeded, getSharpImage } from '../../lib/assetUtils/assetUtils';
import { noNaN } from '../../lib/numbers';
import qs from 'qs';

const SitemapXml: React.FC = () => {
  return <div style={{ background: 'black', height: '100vh' }} />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  const { res, query, req } = context;

  // extract query parameters
  const widthString = (query.width as string) || undefined;
  const format = (query.format || 'webp') as
    | keyof FormatEnum
    | AvailableFormatInfo
    | 'ico'
    | undefined;
  const quality = noNaN(query.quality) || undefined;
  const companySlug = alwaysString(query.companySlug) || DEFAULT_COMPANY_SLUG;

  // get file path
  const urlArray = [ASSETS_DIST, ...alwaysArray(query.url)];
  let filePath = urlArray.join('/');
  const fileName = alwaysString(urlArray[urlArray.length - 1]);
  const initialFileFormatArray = fileName.split('.');
  const initialFileFormat = alwaysString(initialFileFormatArray[initialFileFormatArray.length - 1]);
  const dist = path.join(process.cwd(), `${req.url}`);

  // set the content-type of the response
  res.setHeader('Content-Type', `image/${format}`);
  res.setHeader('Cache-Control', `public, max-age=${ONE_WEEK}`);
  res.setHeader('etag', `${req.url}?${qs.stringify(query)}`);

  // check if watermark needed
  const showWatermark = checkIfWatermarkNeeded(dist);

  // send ico and svg files
  if (
    format === 'svg' ||
    format === 'ico' ||
    initialFileFormat === 'svg' ||
    initialFileFormat === 'ico'
  ) {
    const exists = fs.existsSync(dist);
    if (!exists) {
      const file = await getSharpImage({
        filePath: IMAGE_FALLBACK,
        format: 'webp',
        width: noNaN(widthString),
        showWatermark: false,
        companySlug,
        quality,
      });

      if (!file) {
        return {
          props: {},
          notFound: true,
        };
      }

      res.write(file);
      res.end();
      return {
        props: {},
      };
    }

    const contentType = initialFileFormat === 'ico' ? 'image/ico' : 'image/svg+xml';
    const stat = fs.statSync(dist);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stat.size);

    const buffer = fs.readFileSync(dist);
    res.write(buffer);
    res.end();
    return {
      props: {},
    };
  }

  // get the processed image
  const file = await getSharpImage({
    filePath,
    format,
    width: noNaN(widthString),
    showWatermark,
    companySlug,
    quality,
  });

  if (!file) {
    const file = await getSharpImage({
      filePath: IMAGE_FALLBACK,
      format,
      width: noNaN(widthString),
      showWatermark: false,
      companySlug,
      quality,
    });

    if (!file) {
      return {
        props: {},
        notFound: true,
      };
    }

    res.write(file);
    res.end();
    return {
      props: {},
    };
  }

  res.write(file);
  res.end();
  return {
    props: {},
  };
}

export default SitemapXml;
