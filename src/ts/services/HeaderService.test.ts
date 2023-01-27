import { JSDOM } from "jsdom"
import HeaderService from '../services/HeaderService';
import LocalStorageService from "./LocalStorageService";

//mock localStorageService
jest.spyOn(LocalStorageService.prototype, 'getAll').mockImplementation(
  () => {
    return [
      {
        id: 1,
        count: 10
      },
      {
        id: 2,
        count: 5
      }
    ]
  }
);

jest.spyOn(LocalStorageService.prototype, 'getTotalPrice').mockImplementation(
  () => {
    return 1000;
  }
);

//mock document
const dom = new JSDOM('<!DOCTYPE html>');
global.document = dom.window.document;

//mock window
Object.defineProperty(global, 'window', {
    value: dom.window,
});

describe ('HeaderService tests', () => {


    test('test fillBasketItems()', () => {

      //fake dom elements
      const div = document.createElement('div');
              const p = document.createElement('p');
                p.setAttribute("id", "header_items");
              div.append(p);
      document.body.append(div);

      const headerService = new HeaderService();
      headerService.fillBasketItems();
      const items = document.getElementById('header_items')?.innerHTML;
      expect(items).toEqual("15");        

    });

    test('test fillPrice()', () => {

      //fake dom elements
      const div = document.createElement('div');
              const p = document.createElement('p');
                p.setAttribute("id", "header_price");
              div.append(p);
      document.body.append(div);

      const headerService = new HeaderService();
      headerService.fillPrice();
      const items = document.getElementById('header_price')?.innerHTML;
      expect(items).toEqual("1000 ₴");        

    });

});