import sharp from 'sharp';
import fs, { ReadStream } from 'fs';
import mkdirp from 'mkdirp';
import { Upload } from '../../types/upload';
import del from 'del';

export interface StoreUploadsInterface {
  files: Upload[];
  slug: string;
  dist: string;
  outputFormat?: string;
}

export interface AssetInterface {
  url: string;
  index: number;
}

function getBufferFromFileStream(stream: ReadStream) {
  return new Promise<Buffer>((resolve, reject) => {
    // Store file data chunks in this array
    const chunks: any[] = [];
    // We can use this variable to store the final data
    let fileBuffer;

    // An error occurred with the stream
    stream.once('error', (error) => {
      reject(error);
    });

    // File is done being read
    stream.once('end', () => {
      // create the final data Buffer from data chunks;
      fileBuffer = Buffer.concat(chunks);
      resolve(fileBuffer);
    });

    // Data is flushed from fileStream in chunks,
    // this callback will be executed for each chunk
    stream.on('data', (chunk) => {
      chunks.push(chunk); // push data chunk to array
    });
  });
}

const storeUploads = async ({
  files,
  slug,
  dist,
  outputFormat = 'webp',
}: StoreUploadsInterface): Promise<AssetInterface[]> => {
  const filesPath = `./assets/${dist}/${slug}`;
  const filesResolvePath = `/assets/${dist}/${slug}`;
  const exists = fs.existsSync(filesPath);
  if (!exists) {
    // Create directory if not exists
    await mkdirp(filesPath);
  } else {
    // Clear directory if exists
    await del(filesPath);
    await mkdirp(filesPath);
  }

  return await Promise.all(
    files.map(async (file, index) => {
      const { createReadStream, mimetype } = await file;

      const fileName = `${slug}-${index}`;
      const finalPath = `${filesPath}/${fileName}.${outputFormat}`;
      const resolvePath = `${filesResolvePath}/${fileName}.${outputFormat}`;

      // Attempting to save file in fs
      return new Promise<AssetInterface>(async (resolve, reject) => {
        // Read file into stream.Readable
        const fileStream = createReadStream();
        const buffer = await getBufferFromFileStream(fileStream);

        if (mimetype === `image/svg+xml` || mimetype === `image/svg`) {
          await fs.writeFile(`${filesPath}/${fileName}.svg`, buffer.toString(), (error) => {
            if (error) {
              reject(error);
            }
            resolve({
              url: `${filesResolvePath}/${fileName}.svg`,
              index,
            });
          });
          return;
        }

        // Save file to the FS
        sharp(buffer)
          .toFormat(outputFormat)
          .toFile(finalPath)
          .then(() => {
            resolve({
              url: resolvePath,
              index,
            });
          })
          .catch((error) => {
            reject(error);
          });
      }).catch((e) => {
        console.log(e);
        return { index, url: '' };
      });
    }),
  ).catch((e) => {
    console.log(e);
    return [];
  });
};

export default storeUploads;
