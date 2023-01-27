import BasketService from '../services/BasketService'
import { JSDOM } from "jsdom"
import LocalStorageService from './LocalStorageService';

//mock localStorageService
jest.spyOn(LocalStorageService.prototype, 'getAll').mockImplementation(
  () => {
    return [
      {
        id: 1,
        count: 1
      },
      {
        id: 2,
        count: 1
      },
      {
        id: 3,
        count: 1
      },
      {
        id: 4,
        count: 1
      }
    ]
  }
);

//mock document
const dom = new JSDOM('<!DOCTYPE html>');
global.document = dom.window.document;

//mock window
Object.defineProperty(global, 'window', {
    value: dom.window,
});

describe ('BasketService tests', () => {

  test('test fillPrice()', () => {

    //fake dom elements
    const div = document.createElement('div');
      const s = document.createElement('p');
        s.setAttribute("id", "basket_total_price");
      div.append(s);
      const s2 = document.createElement('p');
        s2.setAttribute("id", "basket_discount_price");
      div.append(s2);
      const s3 = document.createElement('p');
        s3.setAttribute("id", "basket_items");
      div.append(s3);
      const s4 = document.createElement('p');
        s4.setAttribute("id", "basket_items2");
      div.append(s4);
    document.body.append(div);

    const basketService = new BasketService();
    basketService.fillPrice({
      page: 2,
      limit: 3,
      discounts: ['test05', 'test10'],
      url: ""
    });

    const totalPriceElem = document.getElementById('basket_total_price') as HTMLElement;
    const discPriceElem = document.getElementById('basket_discount_price') as HTMLElement;

    expect(parseFloat(totalPriceElem.innerHTML)).toBeGreaterThan(0);
    expect(parseFloat(discPriceElem.innerHTML)).toBeGreaterThan(0);
    expect(parseFloat(totalPriceElem.innerHTML)).toBeGreaterThan(parseFloat(discPriceElem.innerHTML));

    basketService.fillPrice({
      page: 2,
      limit: 3,
      discounts: [],
      url: ""
    });

    const totalPriceElem2 = document.getElementById('basket_total_price') as HTMLElement;
    const discPriceElem2 = document.getElementById('basket_discount_price') as HTMLElement;

    expect(parseFloat(totalPriceElem2.innerHTML)).toBeGreaterThan(0);
    expect(parseFloat(discPriceElem2.innerHTML)).toBeGreaterThan(0);
    expect(parseFloat(totalPriceElem2.innerHTML)).toEqual(parseFloat(discPriceElem2.innerHTML));

  });

  test('test fillControl()', () => {

    //fake dom elements
    const div = document.createElement('div');
      const s = document.createElement('select');
        s.setAttribute("id", "basket_limit");
          const o = document.createElement('option');
            o.setAttribute('value', "3");
          s.append(o);
          const o2 = document.createElement('option');
            o2.setAttribute('value', "5");
          s.append(o2);
      div.append(s);
      const p = document.createElement('p');
        p.setAttribute("id", "basket_page_cur");
      div.append(p);
      const p2 = document.createElement('p');
        p2.setAttribute("id", "basket_page_total");
      div.append(p2);
    document.body.append(div);

    const basketService = new BasketService();
    basketService.fillControl({
      page: 2,
      limit: 3,
      discounts: [],
      url: ""
    });

    const limit = document.getElementById('basket_limit') as HTMLSelectElement;
    expect(limit.value).toEqual("3");
    const pc = document.getElementById('basket_page_cur') as HTMLElement;
    expect(pc.innerHTML).toEqual("2");
    const pt = document.getElementById('basket_page_total') as HTMLElement;
    expect(pt.innerHTML).toEqual("2");     
  });

  test('test checkAllFields()', () => {

    //fake dom elements
    const div = document.createElement('div');
            const b = document.createElement('button');
              b.setAttribute("id", "form_confirm");
            div.append(b);
    document.body.append(div);
    const basketService = new BasketService();

    basketService.isNameValid = true;
    basketService.isAddressValid = true;
    basketService.isTelValid = true;
    basketService.isEmailValid = true;
    basketService.isCard1Valid = true;
    basketService.isCard2Valid = true;
    basketService.isCard3Valid = true;
    basketService.isCard4Valid = true;
    basketService.isDayValid = true;
    basketService.isMonthValid = true;
    basketService.isCvvValid = false;

    basketService.checkAllFields();
    const btnEl = document.getElementById('form_confirm') as HTMLButtonElement;
    expect(btnEl.disabled).toEqual(true);

    basketService.isCvvValid = true;

    basketService.checkAllFields();
    const btnEl2 = document.getElementById('form_confirm') as HTMLButtonElement;
    expect(btnEl2.disabled).toEqual(false);        

  });

  test('test checkCardNum()', () => {

    //fake dom elements
    const div = document.createElement('div');
            const p = document.createElement('p');
              p.setAttribute("id", "form_card_valid");
            div.append(p);
    document.body.append(div);
    const cardEl = document.getElementById('form_card_valid') as HTMLElement;

    const basketService = new BasketService();

    basketService.isCard1Valid = true;
    basketService.isCard2Valid = true;
    basketService.isCard3Valid = true;
    basketService.isCard4Valid = true;

    basketService.checkCardNum();
    expect(cardEl.classList.contains('valid')).toEqual(true);        
    expect(cardEl.classList.contains('invalid')).toEqual(false);        

    basketService.isCard2Valid = false;
    basketService.checkCardNum();

    expect(cardEl.classList.contains('valid')).toEqual(false);        
    expect(cardEl.classList.contains('invalid')).toEqual(true);            

  });

  test('test checkDateCvv()', () => {

      //fake dom elements
      const div = document.createElement('div');
              const p = document.createElement('p');
                p.setAttribute("id", "form_date_valid");
              div.append(p);
              const p2 = document.createElement('p');
              p2.setAttribute("id", "form_cvv_valid");
            div.append(p2);
      document.body.append(div);

      const basketService = new BasketService();

      basketService.isMonthValid = true;
      basketService.isDayValid = true;
      basketService.isCvvValid = true;
      basketService.checkDateCvv();

      const dateEl = document.getElementById('form_date_valid') as HTMLElement;
      const cvvEl = document.getElementById('form_cvv_valid') as HTMLElement;

      expect(dateEl.classList.contains('valid')).toEqual(true);        
      expect(cvvEl.classList.contains('valid')).toEqual(true);        
      expect(dateEl.classList.contains('invalid')).toEqual(false);        
      expect(cvvEl.classList.contains('invalid')).toEqual(false);   

      basketService.isDayValid = false;
      basketService.isCvvValid = false;
      basketService.checkDateCvv();

      expect(dateEl.classList.contains('valid')).toEqual(false);        
      expect(cvvEl.classList.contains('valid')).toEqual(false);      
      expect(dateEl.classList.contains('invalid')).toEqual(true);        
      expect(cvvEl.classList.contains('invalid')).toEqual(true);     

  });

});