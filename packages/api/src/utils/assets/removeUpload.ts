import fs from 'fs';

export async function removeUpload(path: string) {
  try {
    fs.unlinkSync(path);
  } catch (e) {
    console.log(e);
  }
}
