import { JSDOM } from "jsdom"
import UrlService from '../services/UrlService';
import SliderService from '../services/SliderService';

jest.spyOn(UrlService.prototype, 'checkCopyBtn').mockImplementation();

//mock document
const dom = new JSDOM('<!DOCTYPE html>');
global.document = dom.window.document;

//mock window
Object.defineProperty(global, 'window', {
    value: dom.window,
});
jest.spyOn(global.window.history, 'pushState').mockImplementation(); 

describe ('UrlService tests', () => {

    test('test fillUrl()', () => {

      let data = {
            filteredBrands: ['panasonic', 'sony'],
            filteredCats: ['tv'],
            searchText: "test",
            sortSelect: "priceAsc",
            minPrice: 0,
            maxPrice: 0,
            minPriceVal: 10,
            maxPriceVal: 100,
            minStock: 0,
            maxStock: 0,
            minStockVal: 10,
            maxStockVal: 100,
            view: "list",
            url: ""
          }

          const res = '?cat=tv&brand=panasonic,sony&search=test&sort=priceAsc&priceFrom=10&priceTo=100&stockFrom=10&stockTo=100&view=list';
          const urlService = new UrlService();
          data = urlService.fillUrl(data);
          expect(data.url).toEqual(res);          
    });

    test('test parseUrl()', () => {

        let data = {
            filteredBrands: [''],
            filteredCats: [''],
            searchText: "",
            sortSelect: "",
            minPrice: 0,
            maxPrice: 0,
            minPriceVal: 0,
            maxPriceVal: 0,
            minStock: 0,
            maxStock: 0,
            minStockVal: 0,
            maxStockVal: 0,
            view: "",
            url: ""
        }

        const resData = {
            filteredBrands: ['panasonic', 'sony'],
            filteredCats: ['tv'],
            searchText: "test",
            sortSelect: "priceAsc",
            minPrice: 0,
            maxPrice: 0,
            minPriceVal: 10,
            maxPriceVal: 0,
            minStock: 0,
            maxStock: 0,
            minStockVal: 10,
            maxStockVal: 100,
            view: "list",
            url: ""
        }

        const urlService = new UrlService();
        const slider = {} as SliderService;
        slider.setVals = () => true;
        slider.fillCounts = () => true;

        Object.defineProperty(global.window, 'location', {
            value: {
              href: 'localhost:3000?cat=tv&brand=panasonic,sony&search=test&sort=priceAsc&priceFrom=10&stockFrom=10&stockTo=100&view=list',
              search: '?cat=tv&brand=panasonic,sony&search=test&sort=priceAsc&priceFrom=10&stockFrom=10&stockTo=100&view=list',
            }
          });

          //fake dom elements
          const div = document.createElement('div');
              const inputSearch = document.createElement('input');
                inputSearch.setAttribute("id", "search");
              div.append(inputSearch);
                
              const selectSort = document.createElement('select');
                selectSort.setAttribute("id", "sort");
              div.append(selectSort);
          document.body.append(div);
          
          data = urlService.parseURL(data, slider, slider);
          expect(data).toEqual(resData);          
    })

    test('test fillBasketUrl()', () => {

      let data = {
            page: 2,
            limit: 3,
            discounts: ['test05', 'test10'],
            url: ""
          }

          const res = '/basket?limit=3&page=2&discounts=test05,test10';
          const urlService = new UrlService();
          data = urlService.filBasketlUrl(data);
          expect(data.url).toEqual(res);          
    });

    test('test parseBasketUrl()', () => {

      let data = {
        page: 0,
        limit: 0,
        discounts: [''],
        url: ""
      }

      const resData = {
        page: 2,
        limit: 3,
        discounts: ['test05', 'test10'],
        url: ""
      }

      const urlService = new UrlService();
      Object.defineProperty(global.window, 'location', {
          value: {
            href: 'localhost:3000/basket?limit=3&page=2&discounts=test05,test10',
            search: '?limit=3&page=2&discounts=test05,test10',
          }
        });

      data = urlService.parseBasketURL(data);
      expect(data).toEqual(resData);          
  })

  test('test getUrlVar()', () => {

    const urlService = new UrlService();
    Object.defineProperty(global.window, 'location', {
        value: {
          href: 'localhost:3000/?i=3&id=5&idd=10',
          search: '?i=3&id=5&idd=10',
        }
      });

    const id = urlService.getUrlVar('id');
    expect(id).toEqual(5);
  })

});