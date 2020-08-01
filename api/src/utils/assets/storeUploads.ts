import sharp from 'sharp';
import fs, { ReadStream } from 'fs';
import mkdirp from 'mkdirp';
import { Upload } from '../../types/upload';
import del from 'del';

export interface StoreUploadsInterface {
  files: Upload[];
  slug: string;
  city: string;
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
  city,
}: StoreUploadsInterface): Promise<AssetInterface[]> => {
  const filesPath = `./assets/${city}/${slug}`;
  const filesResolvePath = `/assets/${city}/${slug}`;
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
      const { createReadStream } = await file;
      const fileName = `${slug}-${index}`;
      const fileFormat = 'webp';
      const finalPath = `${filesPath}/${fileName}.${fileFormat}`;
      const resolvePath = `${filesResolvePath}/${fileName}.${fileFormat}`;

      // Attempting to save file in fs
      return new Promise<AssetInterface>(async (resolve, reject) => {
        // Read file into stream.Readable
        const fileStream = createReadStream();

        // TODO check here if file is svg and save it to finalPath

        const buffer = await getBufferFromFileStream(fileStream);

        // Save file to the FS
        sharp(buffer)
          .webp()
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
      });
    }),
  );
};

export default storeUploads;
