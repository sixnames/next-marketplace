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

interface ParseApiFormDataPayloadInterface<T> {
  fields: T;
  files?: Formidable.Files;
}

export async function parseApiFormData<T>(
  req: NextApiRequest,
): Promise<ParseApiFormDataPayloadInterface<T> | null> {
  const formData: ParseApiFormDataPayloadInterface<T> = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      const unknownFields = fields as unknown;
      resolve({ fields: unknownFields as T, files });
    });
  });

  if (!formData) {
    return null;
  }

  return formData;
}
