export interface GetEmailTemplateInterface {
  content: string;
}

export const getEmailTemplate = ({ content }: GetEmailTemplateInterface) => {
  return `
<!DOCTYPE html>
<html lang='en' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'>
<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width,initial-scale=1'>
  <meta name='format-detection' content='telephone=no, date=no, address=no, email=no'>
  <meta name='x-apple-disable-message-reformatting'>
  <meta name='color-scheme' content='light dark'>
  <meta name='supported-color-schemes' content='light dark'>
  <title>Email title</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
  </style>
</head>
<body class='body'>
  <div role='article' aria-roledescription='email' aria-label='email name' lang='en' style='font-size:1rem'>
    <!--[if true]>
    <table role="presentation" style="width:37.5em" align="center"><tr><td>
    <![endif]-->
    <div style='max-width:37.5em; margin:0 auto'>
      <!-- email content in here -->
      ${content}
    </div>
    <!--[if true]>
    </td></tr></table>
    <![endif]-->
  </div>
</body>
</html>
  `;
};
