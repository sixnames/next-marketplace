import fetch from 'node-fetch';
import qs from 'qs';

export async function smsSender() {
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) {
    return;
  }
  const params = {
    text: `Тестовое сообщение
    с переносом на новую строку.
    И ещё строка`,
    sign: `SMS Aero`,
  };
  const paramsAsString = qs.stringify(params);
  const url = `https://info@winepoint.ru:${apiKey}@gate.smsaero.ru/v2/sms/send?numbers[]=79262742057&${paramsAsString}`;
  console.log(url);
  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
}
