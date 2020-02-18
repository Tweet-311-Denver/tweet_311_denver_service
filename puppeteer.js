const puppeteer = require('puppeteer');

const abandonedCarForm = async (options) => {
  const { property, location, description, contact } = options;
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.denvergov.org/pocketgov/#/report-a-problem', {waitUntil: 'networkidle2'});
  await page.waitFor(2000);
  
  await page.select('#categorySelect', 'REP_ABANDONEDVEHICLE');
  await page.waitFor(2000);
  await page.select('#QuestionSelect', `string:${property}`);
  await page.type('#QuestionText', location, {wait: 100});
  await page.type('#description', description, {wait: 100});
  await page.type('#typedInEmailInput', contact, {wait: 100});
};

const snowRemoval = async (options) => {
  const { description, contact } = options
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.denvergov.org/pocketgov/#/report-a-problem', {waitUntil: 'networkidle2'});
  await page.waitFor(2000);

  await page.select('#categorySelect', 'REQ_SNOWREMOVAL');
  await page.waitFor(2000);
  await page.type('#description', description, {wait: 100});
  await page.type('#typedInEmailInput', contact, {wait: 100});
}

const illegalParking = async options => {
  const { location, description, property, contact } = options;
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.denvergov.org/pocketgov/#/report-a-problem', {waitUntil: 'networkidle2'});
  await page.waitFor(2000);

  await page.select('#categorySelect', 'REQ_ILLEGALPARKING');
  await page.waitForSelector('#QuestionSelect');
  await page.type('#QuestionText', location, {wait: 100});
  await page.select('#QuestionSelect', `string:${property}`);
  await page.type('#description', description, {wait: 100});
  await page.type('#typedInEmailInput', contact, {wait: 100});
};

const otherForm = async options => {
  const { description, contact } = options;
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.denvergov.org/pocketgov/#/report-a-problem', {waitUntil: 'networkidle2'});
  await page.waitFor(2000);

  await page.select('#categorySelect', 'REQ_OTHER');
  await page.waitForSelector('#description');
  await page.type('#description', description, {wait: 100});
  await page.type('#typedInEmailInput', contact, {wait: 100});
};
