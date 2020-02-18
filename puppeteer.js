const puppeteer = require('puppeteer');

const options = {
  location: '1777 Chestnut Pl',
  description: 'Huge',
  contact: 'test@test.com'
};
const dropdowns = [
  'No',
  'Arm'
]

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


  // await browser.close();
};

abandonedCarForm(options)

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

const damagedFallenTree = async (options, dropdowns) => {
  const { location, description, contact } = options;
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.denvergov.org/pocketgov/#/report-a-problem', {waitUntil: 'networkidle2'});
  await page.waitFor(2000);

  await page.select('#categorySelect', 'REP_DMGDTREE');
  await page.waitForSelector('#QuestionSelect');

  await page.$$eval('#QuestionSelect', (selects, arg1, arg2) => {
    console.log(selects[1]);
    console.log(arg1, arg2)
    selects[0].value=arg1;
    selects[1].value=arg2;
  },`string:${dropdowns[0]}`,`string:${dropdowns[1]}` );

  
  

  await page.waitFor(2000);
  await page.type('#QuestionText', location, {wait: 100});
  await page.type('#description', description, {wait: 100});
  await page.type('#typedInEmailInput', contact, {wait: 100})
}

// damagedFallenTree(options, dropdowns);

