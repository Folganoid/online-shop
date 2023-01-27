import {IfilterData, IProduct, IProductList} from '../interfaces/Common';
import Slider from './SliderService';
import MainRender from './MainRender';

export default class FilterListService {

    public catList: { [key: string]: number; } = {}
    public brandList: { [key: string]: number; } = {}
    private mainRender = new MainRender();
    private sliderPrice: Slider;
    private sliderStock: Slider;

    constructor(sliderPrice: Slider, sliderStock: Slider) {
      this.sliderPrice = sliderPrice;
      this.sliderStock = sliderStock;
    }

    public fillRootList(json: IProductList, data: IfilterData, sliderPrice: Slider, sliderStock: Slider): [IProduct[], IfilterData] {

      const rootList: IProduct[] = [];

      for (const i of json.products) {
        rootList.push(i);
      }
  
          //define minmax price and stock
          data.minPrice = 0;
          data.maxPrice = 0;
          data.minStock = 0;
          data.maxStock = 0;
      
          for (const i of rootList) {
            if (i.price > data.maxPrice) data.maxPrice = i.price;
            if (data.minPrice === 0) data.minPrice = i.price;
            if (i.price < data.minPrice) data.minPrice = i.price;
      
            if (i.stock > data.maxStock) data.maxStock = i.stock;
            if (data.minStock === 0) data.minStock = i.stock;
            if (i.stock < data.minStock) data.minStock = i.stock;
          }
      
          sliderPrice.setEdges(data.minPrice, data.maxPrice);
          sliderStock.setEdges(data.minStock, data.maxStock);
          sliderPrice.setVals(data.minPrice, data.maxPrice);
          sliderStock.setVals(data.minStock, data.maxStock);
      
          sliderStock.fillCounts('stock', data.minStock, data.maxStock);
          sliderPrice.fillCounts('price', data.minPrice, data.maxPrice); 
  
          return [rootList, data];
    }

    public fillCounts(sortedList: IProduct[]): void {
        const sumBrand: { [key: string]: number; } = {};
        const sumCat: { [key: string]: number; } = {};
        for (const i of sortedList) {
          const brand = FilterListService.slug(i.brand);
          const cat = FilterListService.slug(i.category);
          if (!(cat in sumCat)) sumCat[cat] = 0;
          sumCat[cat]++;
          if (!(brand in sumBrand)) sumBrand[brand] = 0;
          sumBrand[brand]++;
        }
    
        const brandInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.main__filter-brand-list input');
        const brandSpans: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.main__filter-brand-list span');
    
        for (let i = 0; i<brandInputs.length; i++) {
          const slug: string | null = brandInputs[i].getAttribute('data-filter');
          if (slug !== null && slug in sumBrand) {
            brandSpans[i].innerHTML = (`( ${sumBrand[slug]} / ${sortedList.length})`)
          } else {
            brandSpans[i].innerHTML = '( 0 / 0 )';
          }
        }
    
        const catInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.main__filter-cat-list input');
        const catSpans: NodeListOf<HTMLSpanElement> = document.querySelectorAll('.main__filter-cat-list span');
    
        for (let i = 0; i<catInputs.length; i++) {
          const slug: string | null = catInputs[i].getAttribute('data-filter');
          if (slug !== null && slug in sumCat) {
            catSpans[i].innerHTML = (`( ${sumCat[slug]} / ${sortedList.length})`)
          } else {
            catSpans[i].innerHTML = '( 0 / 0 )';
          }
        }

        const mainItemsSum = document.getElementById('main_items_sum');
        if (mainItemsSum) {
          mainItemsSum.innerHTML = String(sortedList.length);
        }
    }

    public fillSortedList(data: IfilterData, rootList: IProduct[]): [IfilterData, IProduct[]] {

        let sortedList = JSON.parse(JSON.stringify(rootList));
        
        //sort select
        if (data.sortSelect === "nameAsc") {
          sortedList = sortedList.sort((a: IProduct, b: IProduct) => {
            if (a.title.toUpperCase() > b.title.toUpperCase()) return 1
            return -1;
          });
        } else if (data.sortSelect === "nameDesc") {
          sortedList = sortedList.sort((a: IProduct, b: IProduct) => {
            if (a.title.toUpperCase() > b.title.toUpperCase()) return -1
            return 1;
          });
        } else if (data.sortSelect === "priceAsc") {
          sortedList = sortedList.sort((a: IProduct, b: IProduct) => {
            if (a.price > b.price) return 1
            return -1;
          });
        } else if (data.sortSelect === "priceDesc") {
          sortedList = sortedList.sort((a: IProduct, b: IProduct) => {
            if (a.price > b.price) return -1
            return 1;
          });
        } else if (data.sortSelect === "ratingAsc") {
          sortedList = sortedList.sort((a: IProduct, b: IProduct) => {
            if (a.rating > b.rating) return 1
            return -1;
          });
        } else if (data.sortSelect === "ratingDesc") {
          sortedList = sortedList.sort((a: IProduct, b: IProduct) => {
            if (a.rating > b.rating) return -1
            return 1;
          });
        } 
    
        //search by string
        if (data.searchText !== "") {
          sortedList = sortedList.filter((e: IProduct) => {
            return (
              e.brand.toUpperCase().includes(data.searchText.toUpperCase()) 
              || String(e.price).includes(data.searchText) 
              || e.category.toUpperCase().includes(data.searchText.toUpperCase()) 
              || e.description.toUpperCase().includes(data.searchText.toUpperCase()) 
              || e.description.toUpperCase().includes(data.searchText.toUpperCase()) 
              || e.title.toUpperCase().includes(data.searchText.toUpperCase())
              || String(e.stock).includes(data.searchText)
              || String(e.discountPercentage).includes(data.searchText)
            );
          });
        }
    
        //filter by cat
        if (data.filteredCats.length > 0) {
          sortedList = sortedList.filter((e: IProduct) => {
            return data.filteredCats.includes(FilterListService.slug(e.category));
          });
        }
    
        //filter by brand
        if (data.filteredBrands.length > 0) {
          sortedList = sortedList.filter((e: IProduct) => {
            return data.filteredBrands.includes(FilterListService.slug(e.brand));
          });
        }
    
        //filter by price
        if (data.maxPriceVal < data.maxPrice && data.maxPriceVal != 0) {
          sortedList = sortedList.filter((e: IProduct) => {
            return e.price <= data.maxPriceVal;
          });
        }
        if (data.minPriceVal > data.minPrice && data.minPriceVal != 0) {
          sortedList = sortedList.filter((e: IProduct) => {
            return e.price >= data.minPriceVal;
          });
        }
    
        //filter by stock
        if (data.maxStockVal < data.maxStock && data.maxStockVal != 0) {
          sortedList = sortedList.filter((e: IProduct) => {
            return e.stock <= data.maxStockVal;
          });
        }
        if (data.minStockVal > data.minStock && data.minStockVal != 0) {
          sortedList = sortedList.filter((e: IProduct) => {
            return e.stock >= data.minStockVal;
          });
        }
    
        //define slider edges
        let minPrice = 0;
        let maxPrice = 0;
        for (const i of sortedList) {
          if (minPrice === 0) minPrice = i.price;
          if (maxPrice === 0) maxPrice = i.price;
          if (i.price < minPrice) minPrice = i.price;
          if (i.price > maxPrice) maxPrice = i.price;
        }

        let minStock = 0;
        let maxStock = 0;
        for (const i of sortedList) {
          if (minStock === 0) minStock = i.stock;
          if (maxStock === 0) maxStock = i.stock;
          if (i.stock < minStock) minStock = i.stock;
          if (i.stock > maxStock) maxStock = i.stock;
        }
        
        if (data.minPriceVal === 0 ) {
          this.sliderPrice.setVals(minPrice, -1);
          this.sliderPrice.fillCounts('price', minPrice, -1);
        } else if (data.minPriceVal < minPrice) {
          this.sliderPrice.fillCounts('price', minPrice, -1);
        }
        if (data.maxPriceVal === 0) {
          this.sliderPrice.setVals(-1, maxPrice);  
          this.sliderPrice.fillCounts('price', -1, maxPrice);
        } else if (data.maxPriceVal > maxPrice) {
          this.sliderPrice.fillCounts('price', -1, maxPrice);
        }

        if (data.minStockVal === 0 ) {
          this.sliderStock.setVals(minStock, -1);
          this.sliderStock.fillCounts('stock', minStock, -1);
        } else if (data.minStockVal < minStock) {
          this.sliderStock.fillCounts('stock', minStock, -1);
        }
        if (data.maxStockVal === 0) {
          this.sliderStock.setVals(-1, maxStock);  
          this.sliderStock.fillCounts('stock', -1, maxStock);
        } else if (data.maxStockVal > maxStock) {
          this.sliderStock.fillCounts('stock', -1, maxStock);
        }

        this.mainRender.renderSortedProducts(sortedList, data.view);
        return [data, sortedList];
    }

    public fillFilterList(rootList: IProduct[]): void {

        function sortObject(obj: { [key: string]: number; }): { [key: string]: number; } {
          return Object.keys(obj).sort().reduce(function (result: { [key: string]: number; }, key: string) {
              result[key] = obj[key];
              return result;
          }, {});
        }
    
        for (const i of rootList) {
          if (this.catList[i.category] === undefined) this.catList[i.category] = 0;
          this.catList[i.category]++;
    
          if (this.brandList[i.brand] === undefined) this.brandList[i.brand] = 0;
          this.brandList[i.brand]++;
        }
    
        this.brandList = sortObject(this.brandList);
        this.catList = sortObject(this.catList);
    
        this.mainRender.renderFilterList(this.brandList, this.catList);
      }
    
    static slug(str: string): string {
        return str.replace(' ', '').replace(' ', '').replace('-', "").replace('&', '').replace("'", '').toLowerCase().trim();
    }
}