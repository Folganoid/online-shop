import {IbasketData, IfilterData} from '../interfaces/Common';
import Slider from './SliderService';

export default class UrlService {

    public parseBasketURL(data: IbasketData): IbasketData | never {
      const search: string = window.location.search.substring(1);

      let obj: { [key: string]: string; };
        if (search.length > 0) {
         obj = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
         function(key, value) {
          return key===""?value:decodeURIComponent(value) 
         }
        );
        } else {
          obj = {};
        }

        if (obj.page) {
          data.page = +obj.page;
        }

        if (obj.limit) {
          data.limit = +obj.limit;
        }

        if (obj.discounts) {
          data.discounts = obj.discounts.split(',');
        }

        //modal
        if (obj.buynow) {
          const modalBlock = document.getElementById('basket_modal') as HTMLSelectElement | null;
          if (modalBlock) {
            modalBlock.style.display = 'flex';
            window.history.pushState({}, '', (data.url.length > 0) ? data.url : '/basket');
          }
        }

        return data;
    }



    public parseURL(data: IfilterData, sliderPrice: Slider, sliderStock: Slider): IfilterData | never {
        const search: string = window.location.search.substring(1);
        
        let obj: { [key: string]: string; };
        if (search.length > 0) {
         obj = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
         function(key, value) {
          return key===""?value:decodeURIComponent(value) 
         }
        );
        } else {
          obj = {};
        }
    
        //fill search
        if (obj.search) {
          const search = document.getElementById('search') as HTMLInputElement | null;
          if (search === null) throw new Error('Something wrong with #search');
          search.value = obj.search;
          data.searchText = obj.search;
        }
    
        //fill sort
        if (obj.sort) {
          const sort = document.getElementById('sort') as HTMLSelectElement | null;
          if (sort === null) throw new Error('Something wrong with #sort');
          sort.value = obj.sort;
          data.sortSelect = obj.sort;
        }
    
        //fill brands
        if (obj.brand) {
          for (const i of obj.brand.split(',')) {
            const element: HTMLInputElement | null = document.querySelector(`#filter_by_brand [data-filter="${i}"]`);
            if (element !== null) {
              element.checked = true;
              element.setAttribute('checked', "true");
            }
          }
          data.filteredBrands = obj.brand.split(',');
        }
    
        //fill cats
        if (obj.cat) {
          for (const i of obj.cat.split(',')) {
            const element: HTMLInputElement | null = document.querySelector(`#filter_by_cat [data-filter="${i}"]`);
            if (element !== null) {
              element.checked = true;
              element.setAttribute('checked', "true");
            }
          }
          data.filteredCats = obj.cat.split(',');
        }
    
        //fillPrice
        if (obj.priceFrom) {
          data.minPriceVal = +obj.priceFrom;
          sliderPrice.setVals(+obj.priceFrom, -1);
          sliderPrice.fillCounts('price', data.minPriceVal, -1);
        }
        if (obj.priceTo) {
          data.maxPriceVal = +obj.priceTo;
          sliderPrice.setVals(-1, +obj.priceTo);
          sliderPrice.fillCounts('price', -1, data.maxPriceVal);
        }
    
        //fillStock
        if (obj.stockFrom) {
          data.minStockVal = +obj.stockFrom;
          sliderStock.setVals(+obj.stockFrom, -1);
          sliderStock.fillCounts('stock', data.minStockVal, -1);
        }
        if (obj.stockTo) {
          sliderStock.setVals(-1, +obj.stockTo);
          data.maxStockVal = +obj.stockTo;
          sliderStock.fillCounts('stock', -1, data.maxStockVal);
        }

        //fill view
        if (obj.view) {
          data.view = obj.view;
        }
        this.checkCopyBtn();
        return data;
    }

    public filBasketlUrl(data: IbasketData): IbasketData {
      let str = '/basket?';

      if (data.limit > 0) {
        str += 'limit=';
        str += data.limit;
        str += '&';
      }

      if (data.page > 1) {
        str += 'page=';
        str += data.page;
        str += '&';
      }

      if (data.discounts.length > 0) {
        str += 'discounts=';
        str += data.discounts.join(',');
        str += '&';
      }

      if (str[str.length - 1] === "&") str = str.slice(0, -1);
      if (str === "/basket?") str = "/basket";
      data.url = str;
  
      window.history.pushState({}, '', (data.url.length > 0) ? data.url : '/');
  
      return data;
    }
    
    public fillUrl(data: IfilterData): IfilterData {
        let str = '?';
        if (data.filteredCats.length > 0) {
          str += 'cat=';
          str += data.filteredCats.join(',');
          str += '&';
        }
        if (data.filteredBrands.length > 0) {
          str += 'brand=';
          str += data.filteredBrands.join(',');
          str += '&';
        }
    
        if (data.searchText !== "") {
          str += `search=${data.searchText}&`;
        }
    
        if (data.sortSelect !== "") {
          str += `sort=${data.sortSelect}&`;
        }
    
        if (data.minPriceVal !== 0 && data.minPriceVal != data.minPrice) {
          str += `priceFrom=${data.minPriceVal}&`;
        }
        if (data.maxPriceVal !== 0 && data.maxPriceVal != data.maxPrice) {
          str += `priceTo=${data.maxPriceVal}&`;
        }
    
        if (data.minStockVal !== 0 && data.minStockVal != data.minStock) {
          str += `stockFrom=${data.minStockVal}&`;
        }
        if (data.maxStockVal !== 0 && data.maxStockVal != data.maxStock) {
          str += `stockTo=${data.maxStockVal}&`;
        }

        if (data.view !== "tiles") {
          str += `view=${data.view}&`;
        }
        
        if (str[str.length - 1] === "&") str = str.slice(0, -1);
        if (str === "?") str = "";
        data.url = str;
    
        window.history.pushState({}, '', (data.url.length > 0) ? data.url : '/');
        this.checkCopyBtn();

        return data;
      }

      public getUrlVar(variable: string): number {
        const query: string = window.location.search.substring(1);
        const vars: string[] = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair: string[] = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return Number.parseInt(decodeURIComponent((pair[1])));
            }
        }
        return 0;
      }

      public checkCopyBtn(): void | never {

        const copy = document.getElementById('copy') as HTMLButtonElement | null;
        if (copy === null) throw new Error('Something wrong with #copy');

        try {
          navigator.clipboard.readText()
            .then(text => {
              let url = '';
              url += window.location.protocol + '//';
              url += window.location.host;
              url += window.location.pathname;
              url += window.location.search;

              if (text === url) {
                copy.disabled = true;
              } else {
                copy.disabled = false;
              }
            }
          )
        } catch (e) {
          console.log('Failed to copy: Browser do not have permission for clipboard');
        }
      }
}