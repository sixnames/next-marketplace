import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { getSharpImage } from '../src/utils/assets/getSharpImage';

export async function assetsRoute(req: Request, res: Response) {
  // Extract the query-parameter
  const widthString = (req.query.width as string) || undefined;
  const heightString = (req.query.height as string) || undefined;
  const format = (req.query.format as string) || 'webp';
  let filePath = req.path;

  if (format === 'svg') {
    filePath = path.resolve(`.${req.path}`);
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
  res.type(`image/${format}`);

  // Get the processed image
  const file = await getSharpImage({ path: filePath, format, width, height });

  if (file) {
    file.pipe(res);
  } else {
    res.status(404);
    res.send();
  }
}
