import fs from 'fs';
import path from 'path';

export async function removeUpload(resource: string) {
  try {
    const filePath = path.join(process.cwd(), resource);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.log(`Error in removeUpload`);
    console.log(e);
  }
}
