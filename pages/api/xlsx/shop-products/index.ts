import { ROLE_SLUG_ADMIN } from 'config/common';
import xlsx, { IJsonSheet, ISettings } from 'json-as-xlsx';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionRole } from 'lib/sessionHelpers';
import addZero from 'add-zero';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { role } = await getSessionRole({ req, res });
  if (role.slug !== ROLE_SLUG_ADMIN) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized',
    });
    return;
  }
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const dateString = `${addZero(date, 2)}.${addZero(month, 2)}.${year}_${addZero(
    hours,
    2,
  )}_${addZero(minutes, 2)}`;

  const data: IJsonSheet[] = [
    {
      sheet: dateString,
      columns: [
        { label: 'User', value: 'name' },
        { label: 'Age', value: 'age' },
        { label: 'Phone', value: 'phone' },
      ],
      content: [
        { name: 'Andrea', age: 20, phone: '11111111' },
        { name: 'Luis', age: 21, phone: '12345678' },
      ],
    },
  ];

  const settings: ISettings = {
    fileName: 'MySpreadsheet', // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeOptions: {
      type: 'buffer',
      bookType: 'xlsx',
    },
  };

  const file = xlsx(data, settings);
  if (file) {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${dateString}.xlsx`);
    res.send(file);
    return;
  }

  res.status(500).send({
    success: false,
    message: 'Server Error',
  });
  return;
};
