// Run once from Extensions > Apps Script in the destination spreadsheet.
function setupStudyfolkForms() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!sheet || sheet.getId() !== '198m9uLeZdX8WBDjYWLAg2bt9VQDfKFd1Y_2TT8Ptzf8') {
    throw new Error('Open the client’s Studyfolk spreadsheet and run this script from Extensions > Apps Script.');
  }
  const properties = PropertiesService.getScriptProperties();
  const roles = [
    { key: 'STUDENT', title: 'Student enquiry', fields: ['Student name', 'Parent or guardian email', 'Contact number', 'City', 'Class and board', 'Subjects of interest', 'Learning goals'] },
    { key: 'TEACHER', title: 'Teacher application', fields: ['Teacher name', 'Email address', 'Contact number', 'City', 'Subjects and classes taught', 'Qualifications and experience', 'Availability'] }
  ];
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    for (const role of roles) {
      const id = properties.getProperty(role.key);
      const form = id ? FormApp.openById(id) : FormApp.create('Studyfolk | ' + role.title, false);
      if (!id) properties.setProperty(role.key, form.getId());
      const existing = form.getItems().map(item => item.getTitle());
      for (const [index, title] of role.fields.entries()) {
        if (existing.includes(title)) continue;
        const item = index === 6 ? form.addParagraphTextItem() : form.addTextItem();
        item.setTitle(title).setRequired(true);
        if (index === 1) item.setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
      }
      form.setPublishingSummary(false).setConfirmationMessage('Thank you. Studyfolk has received your details.');
      const linkedKey = role.key + '_LINKED_FORM';
      if (properties.getProperty(linkedKey) !== form.getId()) {
        form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
        properties.setProperty(linkedKey, form.getId());
      }
      if (form.getDestinationId() !== sheet.getId()) throw new Error(role.title + ' is linked to a different spreadsheet. Check its Responses settings.');
      form.setPublished(true);
      console.log('VITE_' + role.key + '_FORM_URL=' + form.getPublishedUrl());
    }
  } finally {
    lock.releaseLock();
  }
}
