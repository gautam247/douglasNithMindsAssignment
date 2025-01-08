import { Page } from '@playwright/test';

export class DouglasPage {
  private page: Page;
  private acceptCookiesButton;
  private navigationLink;
  private flagsFilter;
  private classificationFilter;
  private brandFilter;
  private genderFilter;
  private giftForFilter;
  private productGrid = '.product-grid';
  private productItems = '.product-grid-column';

  constructor(page: Page) {
    this.page = page;
    this.acceptCookiesButton = this.page.locator('[data-testid="uc-accept-all-button"]');
    this.navigationLink = this.page.locator('[data-testid="header-component-item--navigation"] >> text=PARFUM');
    this.flagsFilter = this.page.locator('[data-testid="flags"]');
    this.classificationFilter = this.page.locator('[data-testid="classificationClassName"]');
    this.brandFilter = this.page.locator('[data-testid="brand"]');
    this.genderFilter = this.page.locator('[data-testid="gender"]');
    this.giftForFilter = this.page.locator('[data-testid="Geschenk für"] [data-testid="arrow-icon"]');
  }

  async navigateToHomePage(baseURL): Promise<void> {
    await this.page.goto(baseURL);
    await this.page.waitForResponse(response =>
      response.url() === 'https://www.douglas.de/jsapi/v2/gigya/consent/details' && response.status() === 200
    );
  }

  async acceptCookies(): Promise<void> {
    await this.acceptCookiesButton.click();
  }

  async navigateToPerfumeSection(): Promise<void> {
    await this.navigationLink.click();
    await this.page.locator('role=heading[name="Parfüm & Düfte"]').waitFor();
  }

  async applyFilter(filter: { highlight: string; marke: string; produktart: string; geschenkFur: string; furWen: string }): Promise<void> {
    await this.flagsFilter.click();
    await this.page.locator(`role=checkbox[name="${filter.highlight}"]`).click();

    await this.classificationFilter.locator('span').click();
    await this.page.fill('[placeholder="Produktart suchen"]', filter.produktart);
    await this.page.locator(`role=checkbox[name="${filter.produktart}"]`).click();

    await this.brandFilter.click();
    await this.page.fill('[placeholder="Marke suchen"]', filter.marke);
    await this.page.locator(`role=checkbox[name="${filter.marke}"]`).click();

    await this.genderFilter.click();
    await this.page.locator(`role=checkbox[name="${filter.furWen}"]`).click();

    await this.giftForFilter.click();
    await this.page.locator(`role=checkbox[name="${filter.geschenkFur}"]`).click();
  }

  async fetchProductDetails(): Promise<{ name: string | null; price: string | null }[]> {
    await this.page.waitForSelector(this.productGrid);

    return await this.page.$$eval(this.productItems, items => {
      return items.map(item => {
        const name = item.querySelector('.product-info .product-info__details')?.textContent?.trim() || null;
        const price = item.querySelector('.product-price__no-discount')?.textContent?.trim() ||
          item.querySelector('.product-price__discount .product-price__price')?.textContent?.trim() || null;
        return { name, price };
      });
    });
  }
}
