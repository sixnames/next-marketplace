import fetch from 'node-fetch';
import qs from 'qs';

interface SmsSenderInterface {
  text: string;
  sign: string;
  numbers: string[];
}

export async function smsSender({ text, sign, numbers }: SmsSenderInterface) {
  try {
    const apiKey = process.env.SMS_API_KEY;
    const apiEmail = process.env.SMS_API_EMAIL;
    if (!apiKey || !apiEmail) {
      return;
    }

    // params
    const params = {
      text,
      sign,
      shortLink: 1,
    };
    const paramsAsString = qs.stringify(params);

    // numbers
    const numbersAsString = numbers
      .reduce((acc: string[], number) => {
        return [...acc, `numbers[]=${number}`];
      }, [])
      .join('&');

    // final url params
    const finalParamsArray = [paramsAsString, numbersAsString];
    const finalParamsAsString = finalParamsArray.join('&');

    const url = `https://${apiEmail}:${apiKey}@gate.smsaero.ru/v2/sms/send?${finalParamsAsString}`;
    await fetch(url);
  } catch (e) {
    console.log(`smsSender Error`);
    console.log(e);
  }
}
