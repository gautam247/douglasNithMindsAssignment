import { test, expect } from '@playwright/test';
import  {DouglasPage} from '../pages/douglasPage'
import * as fs from 'fs';

const filters = [
  { highlight: 'Sale', marke: 'Aigner', produktart: 'Eau de Parfum', geschenkFur: 'Valentinstag', furWen: 'Unisex' },
  { highlight: 'Neu', marke: 'Berdoues', produktart: 'Eau de Toilette', geschenkFur: 'Valentinstag', furWen: 'Unisex' },
  { highlight: 'Limitier', marke: 'Armani', produktart: 'Eau de Parfum', geschenkFur: 'Valentinstag', furWen: 'Weiblich' },
];

const results: Record<string, { name: string | null; price: string | null }[]> = {};

test.describe('Douglas Parfum Test Suite', () => {
  let douglasPage: DouglasPage;

  test.beforeEach(async ({ page,baseURL }) => {
    douglasPage = new DouglasPage(page);
    await douglasPage.navigateToHomePage(baseURL);
    await douglasPage.acceptCookies();
  });

  test('Filter and save products in Json file ', async () => {
    for (const filter of filters) {
      await douglasPage.navigateToPerfumeSection();
    
      await douglasPage.applyFilter(filter);

      const products = await douglasPage.fetchProductDetails();
      results[filter.highlight] = products;

      await expect(products.length).toBeGreaterThan(0);
    }
  });

  test.afterAll(async () => {
    const filePath = './test-results/products.json';
    try {
      fs.mkdirSync('./test-results', { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf8');
      console.log(`\nProduct data has been saved to: ${filePath}`);
    } catch (err) {
      console.error('Error writing results:', err);
    }
  });
});
