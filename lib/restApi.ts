import Formidable, { IncomingForm } from 'formidable';
import { NextApiRequest } from 'next';

interface ParseRestApiFormDataPayloadInterface {
  fields: Formidable.Fields;
  files?: Formidable.Files;
}

export async function parseRestApiFormData(
  req: NextApiRequest,
): Promise<ParseRestApiFormDataPayloadInterface | null> {
  const formData: ParseRestApiFormDataPayloadInterface = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });

  if (!formData) {
    return null;
  }

  return formData;
}
