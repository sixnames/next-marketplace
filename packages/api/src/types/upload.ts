import { ReadStream } from 'fs';

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}
