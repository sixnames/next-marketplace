import { ROLE_SLUG_ADMIN } from 'config/common';
import xlsx, { IJsonSheet, ISettings } from 'json-as-xlsx';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionRole } from 'lib/sessionHelpers';

const data: IJsonSheet[] = [
  {
    sheet: 'Adults',
    columns: [
      { label: 'User', value: 'user' }, // Top level data
      { label: 'Age', value: (row) => row.age + ' years' }, // Run functions
    ],
    content: [
      { user: 'Andrea', age: 20, more: { phone: '11111111' } },
      { user: 'Luis', age: 21, more: { phone: '12345678' } },
    ],
  },
];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { role } = await getSessionRole({ req, res });
  if (role.slug !== ROLE_SLUG_ADMIN) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  const settings: ISettings = {
    fileName: 'MySpreadsheet', // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeOptions: {
      type: 'buffer',
      bookType: 'xlsx',
    },
  };

  const file = xlsx(data, settings); // Will download the excel file
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename=dummy.xlsx`);

  res.send(file);
  return;
};
