import { getSharpImage } from 'lib/assetUtils/getSharpImage';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { FormatEnum } from 'sharp';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Extract the query-parameter
  const widthString = (req.query.width as string) || undefined;
  const heightString = (req.query.height as string) || undefined;
  const format = (req.query.format as keyof FormatEnum) || 'webp';
  let filePath = 'req.path';
  // let filePath = req.path;

  if (format === 'svg') {
    filePath = path.resolve(`.${filePath}`);
    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Content-Length': stat.size,
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    return;
  }

  // Parse to integer if possible
  let width, height;
  if (widthString) {
    width = parseInt(widthString);
  }
  if (heightString) {
    height = parseInt(heightString);
  }

  // Set the content-type of the response
  res.setHeader('Content-Type', `image/${format}`);

  // Check if file exists
  const exists = fs.existsSync(`${process.cwd()}${filePath}`);

  if (!exists) {
    res.status(404);
    res.send({});
    return;
  }

  // Get the processed image
  const file = await getSharpImage({ path: filePath, format, width, height });

  if (file) {
    file.pipe(res);
  } else {
    res.status(404);
    res.send({});
  }
};
