function doPost(e) {
  const sheet = SpreadsheetApp.openById("1R-8ekalS1cWW4PV2wQmwwLgDL9e-slFldLp3VRvkdyw")
                 .getSheetByName("Лист1");
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.name, data.contact, new Date()]);
  return ContentService.createTextOutput(
    JSON.stringify({message: "Успешно записано!"})
  ).setMimeType(ContentService.MimeType.JSON);
}
