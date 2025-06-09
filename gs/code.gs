// RU: основной скрипт обработки заявок
const SHEET_ID = '19rqlaXGsNhdvWh7EneaNDMIY3LDoWpWF-R7dETaAvo4';
const SHEET_NAME = 'Лист1';

function doGet(e) {
  const action = e.parameter.action;
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (action === 'count') {
    const offline = Number(sheet.getRange('C1').getValue());
    const online = Number(sheet.getRange('D1').getValue());
    return ContentService.createTextOutput(JSON.stringify({ offline, online }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('ok');
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.phone || '',
    data.mode
  ]);

  if (data.mode === 'offline') {
    sheet.getRange('C1').setValue(sheet.getRange('C1').getValue() - 1);
  } else {
    sheet.getRange('D1').setValue(sheet.getRange('D1').getValue() - 1);
  }

  const subject = 'Подтверждение регистрации';
  const offlineText = 'Москва, ул. Беговая, 12';
  const onlineText = 'Ссылка на Zoom: <link>'; // замените на настоящий
  const body = `Спасибо за регистрацию!\n\n` +
    (data.mode === 'offline' ? offlineText : onlineText);
  GmailApp.sendEmail(data.email, subject, body);

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
