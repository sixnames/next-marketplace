import { DEFAULT_LOCALE, LOCALE_NOT_FOUND_FIELD_MESSAGE, SECONDARY_LOCALE } from 'config/common';
import { getFieldStringLocale } from 'lib/i18n';
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
    if (!apiKey || !apiEmail || numbers.length < 1) {
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
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
  } catch (e) {
    console.log(`smsSender Error`);
    console.log(e);
  }
}

interface SendSmsInterface {
  locale: string;
  sign: string;
  orderId: string;
  numbers: string[];
}

export async function sendNewOrderSms({ locale, sign, orderId, numbers }: SendSmsInterface) {
  const messageI18n = {
    [DEFAULT_LOCALE]: `№${orderId}`,
    [SECONDARY_LOCALE]: `№${orderId}`,
  };
  const text = getFieldStringLocale(messageI18n, locale);
  if (text === LOCALE_NOT_FOUND_FIELD_MESSAGE || !text) {
    return;
  }

  await smsSender({
    text,
    sign,
    numbers,
  });
}
