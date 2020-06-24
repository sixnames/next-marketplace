import { API_URL } from '../config';
import { AssetType } from '../generated/apolloComponents';

export async function getImageBlobFromUrl(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${API_URL}${url}`, true);
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

export async function getAllImagesBlobsFromUrl(assets: AssetType[]) {
  return Promise.all(
    assets.map(async ({ url }) => {
      const blob = await getImageBlobFromUrl(url);
      return readImageBlob(blob);
    }),
  );
}

export async function getAllFilesFromUrlsList(assets: AssetType[]) {
  return Promise.all(
    assets.map(async ({ url }) => {
      const blob = await getImageBlobFromUrl(url);
      return getFileFromUrl({ url, buffer: blob });
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

function getFileFromUrl({ buffer, url, type = 'image/jpeg' }: GetFileFromUrlInterface) {
  const urlArray = url.split('/');
  const fullFileName = urlArray[urlArray.length - 1];
  const fileName = fullFileName.split('.')[0];

  return new File([buffer], fileName, { type });
}
