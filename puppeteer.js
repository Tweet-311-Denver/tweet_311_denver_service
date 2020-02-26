const puppeteer = require('puppeteer');

exports.methods = {
  snowRemoval: async (options) => {
    const { description, email, address } = options
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto('https://www.denvergov.org/pocketgov/#/report-a-problem', {waitUntil: 'networkidle2'});
    await page.waitFor(2000);
  
    await page.select('#categorySelect', 'REQ_SNOWREMOVAL');
    await page.waitFor(2000);
    await page.type('#searchTerm', address, {wait: 100});
    await page.waitFor(2000);
    await page.click('#addressInputBtn');
    await page.type('#description', description, {wait: 100});
    await page.type('#typedInEmailInput', email, {wait: 100});
    await page.waitFor(1000);
    await page.click('#submitReport');
    await page.waitForNavigation();
    const confirmationNotes = await page.evaluate(() => {
      let notes = Array.from(document.querySelectorAll('div.col-sm-9')).map(note => {
        return note.innerText;
    });
      return notes
    });
  
    const confirmation = {
      caseID: confirmationNotes[0],
      category: confirmationNotes[1],
      submittedAs: confirmationNotes[2],
      submittedAt: confirmationNotes[3],
      notes: confirmationNotes[4]
    }
  
    await browser.close();
    return confirmation
  },
  otherForm: async options => {
    const { description, email, address } = options;
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setui-sandbox']});
    const page = await browser.newPage();
  
    await page.goto('https://www.denvergov.org/pocketgov/#/report-a-problem', {waitUntil: 'networkidle2'});
    await page.waitFor(2000);

    await page.select('#categorySelect', 'REQ_OTHER');
    await page.waitForSelector('#description');
    await page.type('#searchTerm', address, {wait: 100});
    await page.waitFor(2000);
    await page.click('#addressInputBtn');
    await page.type('#description', description, {wait: 100});
    await page.type('#typedInEmailInput', email, {wait: 100});
    await page.waitFor(1000);

    await page.click('#submitReport');
    await page.waitForNavigation();
    const confirmationNotes = await page.evaluate(() => {
      let notes = Array.from(document.querySelectorAll('div.col-sm-9')).map(note => {
        return note.innerText;
    });
      return notes
    });
  
    const confirmation = {
      caseID: confirmationNotes[0],
      category: confirmationNotes[1],
      submittedAs: confirmationNotes[2],
      submittedAt: confirmationNotes[3],
      notes: confirmationNotes[4]
    };
  
    await browser.close();
    return confirmation
  }
};
