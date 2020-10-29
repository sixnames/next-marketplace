import { AssetType } from '../generated/apolloComponents';
import { ASSETS_URL } from '../config';

export async function getImageFromUrl(
  url: string,
  format = 'png',
  type: XMLHttpRequestResponseType,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${ASSETS_URL}${url}?format=${format}`, true);
    xhr.responseType = type;
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(this);
      }
    };
    xhr.send();
  });
}

export async function getImageBlobFromUrl(url: string, format = 'png'): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${ASSETS_URL}${url}?format=${format}`, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(this);
      }
    };
    xhr.send();
  });
}

export async function getAllImagesBlobsFromUrl(assets: AssetType[], format?: string) {
  return Promise.all(
    assets.map(async ({ url }) => {
      const blob = await getImageBlobFromUrl(url, format);
      return readImageBlob(blob);
    }),
  );
}

export async function getAllFilesFromUrlsList(assets: AssetType[], format?: string, type?: string) {
  return Promise.all(
    assets.map(async ({ url }) => {
      const blob = await getImageBlobFromUrl(url, format);
      return getFileFromUrl({ url, buffer: blob, type });
    }),
  );
}

export async function readImageBlob(blob: Blob) {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
}

interface GetFileFromUrlInterface {
  buffer: Buffer;
  url: string;
  type?: string;
}

function getFileFromUrl({ buffer, url, type = 'image/png' }: GetFileFromUrlInterface) {
  const urlArray = url.split('/');
  const fullFileName = urlArray[urlArray.length - 1];
  const fileName = fullFileName.split('.')[0];

  return new File([buffer], fileName, { type });
}