interface EventObject {
  onerror: any;
  target: {
    src: string;
    style: {
      width: string;
      height: string;
      top: string;
      left: string;
      position: string;
    };
  };
}

export function imageFallback(e: EventObject) {
  e.onerror = null;
  e.target.src = '/fallback/no-image.svg';
  e.target.style.width = '70%';
  e.target.style.height = '70%';
  e.target.style.top = '15%';
  e.target.style.left = '15%';
  e.target.style.position = 'absolute';
}

export async function getUrlBlobs(paths = [], extension = 'image/jpeg') {
  /*async function createFile(fileUrl: string) {
    const filePath = fileUrl.split('/');
    const fileName = filePath[filePath.length - 1];
    const response = await fetch(fileUrl);
    const data = await response.blob();
    const metadata = {
      type: extension,
    };
    return new File([data], fileName, metadata);
  }

  const blobs = paths.map((fileUrl) => createFile(fileUrl));
  return Promise.all(blobs);*/
  return { paths, extension };
}
