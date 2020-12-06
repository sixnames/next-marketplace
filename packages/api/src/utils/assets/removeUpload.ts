import fs from 'fs';

export async function removeUpload(path: string) {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (e) {
    console.log(`Error in removeUpload`);
    console.log(e);
  }
}
