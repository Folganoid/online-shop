import json from "../../data/data.json";
import Slider from "../services/SliderService";
import UrlService from "../services/UrlService";
import FilterListService from "../services/FilterListService";
import {IfilterData, IProduct} from '../interfaces/Common';
import AddBasketWindow from "../listeners/AddBasketWindow";
import HeaderService from "../services/HeaderService";
import SliderRender from "../services/SliderRender";

export default class MainHandler {

  private rootList: IProduct[] = [];
  private sortedList: IProduct[] = [];
  private urlService =  new UrlService();
  private sliderPrice = new Slider('#lowerPrice', '#upperPrice');
  private sliderStock = new Slider('#lowerStock', '#upperStock');
  private filterListService = new FilterListService(this.sliderPrice, this.sliderStock);
  private headerService = new HeaderService();
  private sliderRender = new SliderRender();

  private filterData: IfilterData = {
    filteredBrands: [],
    filteredCats: [],
    searchText: '',
    sortSelect: '',
    minPrice: 0,
    maxPrice: 0,
    minPriceVal: 0,
    maxPriceVal: 0,
    minStock: 0,
    maxStock: 0,
    minStockVal: 0,
    maxStockVal: 0,
    view: 'tiles',
    url: '',
  }

  private selectView = document.querySelector('#viewType') as HTMLSelectElement;

  public init(): void | Error {

    try {

      [this.rootList, this.filterData] = this.filterListService.fillRootList(json, this.filterData, this.sliderPrice, this.sliderStock);
      this.filterListService.fillFilterList(this.rootList);

      this.filterData = this.filterListener(this.filterData);
      this.filterData = this.urlService.parseURL(this.filterData, this.sliderPrice, this.sliderStock);

      [this.filterData, this.sortedList] = this.filterListService.fillSortedList(this.filterData, this.rootList);
      this.cardListener();
      this.filterListService.fillCounts(this.sortedList);

      this.sliderPrice.init();
      this.sliderStock.init();
      this.slidersListener(this.filterData);

      this.logoListener();

      this.headerService.fillBasketItems();
      this.headerService.fillPrice();

      this.selectView?.addEventListener('change',()=>{
        this.filterData.view = this.selectView?.options[this.selectView.selectedIndex].value;
        [this.filterData, this.sortedList] = this.filterListService.fillSortedList(this.filterData, this.rootList);
        this.filterData = this.urlService.fillUrl(this.filterData);
      });

      this.sliderRender.render();

    } catch (err) {
      return err as Error;
    }
  }

  private slidersListener(data: IfilterData) {
    const lowerPrice: HTMLElement | null = document.getElementById('lowerPrice');
    if (lowerPrice === null) throw new Error('something wrong with #lowerPrice');
    const upperPrice: HTMLElement | null = document.getElementById('upperPrice');
    if (upperPrice === null) throw new Error('something wrong with #upperPrice');
    const lowerStock: HTMLElement | null = document.getElementById('lowerStock');
    if (lowerStock === null) throw new Error('something wrong with #lowerStock');
    const upperStock: HTMLElement | null = document.getElementById('upperStock');
    if (upperStock === null) throw new Error('something wrong with #upperStock');

    upperPrice.addEventListener('input', () => {
      const priceVals: number[] | undefined = this.sliderPrice.getVals();
      if (priceVals) {
        data.minPriceVal = priceVals[0];
        data.maxPriceVal = priceVals[1];
        this.sliderPrice.fillCounts('price', data.minPriceVal, data.maxPriceVal);
        [data, this.sortedList] = this.filterListService.fillSortedList(data, this.rootList);
        this.filterData = this.urlService.fillUrl(this.filterData);
        this.filterListService.fillCounts(this.sortedList);
      }
    })

    lowerPrice.addEventListener('input', () => {
      const priceVals: number[] | undefined = this.sliderPrice.getVals();
      if (priceVals) {
        data.minPriceVal = priceVals[0];
        data.maxPriceVal = priceVals[1];
        this.sliderPrice.fillCounts('price', data.minPriceVal, data.maxPriceVal);
        [data, this.sortedList] = this.filterListService.fillSortedList(data, this.rootList);
        this.filterData = this.urlService.fillUrl(this.filterData);
        this.filterListService.fillCounts(this.sortedList);
      }
    })

    upperStock.addEventListener('input', () => {
      const stockVals: number[] | undefined = this.sliderStock.getVals();
      if (stockVals) {
        data.minStockVal = stockVals[0];
        data.maxStockVal = stockVals[1];
        this.sliderPrice.fillCounts('stock', data.minStockVal, data.maxStockVal);
        [data, this.sortedList] = this.filterListService.fillSortedList(data, this.rootList);
        this.filterData = this.urlService.fillUrl(this.filterData);
        this.filterListService.fillCounts(this.sortedList);
      }
    })

    lowerStock.addEventListener('input', () => {
      const stockVals: number[] | undefined = this.sliderStock.getVals();
      if (stockVals) {
        data.minStockVal = stockVals[0];
        data.maxStockVal = stockVals[1];
        this.sliderPrice.fillCounts('stock', data.minStockVal, data.maxStockVal);
        [data, this.sortedList] = this.filterListService.fillSortedList(data, this.rootList);
        this.filterData = this.urlService.fillUrl(this.filterData);
        this.filterListService.fillCounts(this.sortedList);
      }
    })
  }

  private filterListener(data: IfilterData): IfilterData | never {

    const catFilterList: HTMLElement | null = document.getElementById('filter_by_cat');
    const brandFilterList: HTMLElement | null = document.getElementById('filter_by_brand');
    const search = document.getElementById('search') as HTMLInputElement | null;
    const sortSelect = document.getElementById('sort') as HTMLSelectElement | null;
    const reset = document.getElementById('reset') as HTMLButtonElement | null;
    const copy = document.getElementById('copy') as HTMLButtonElement | null;
    const mainFilterCatList: NodeListOf<HTMLInputElement> | null = document.querySelectorAll('#filter_by_cat input');
    const mainFilterBrandList: NodeListOf<HTMLInputElement> | null = document.querySelectorAll('#filter_by_brand input');

    if (catFilterList === null) throw new Error('Something wrong with #filter_by_cat');
    if (brandFilterList === null) throw new Error('Something wrong with #filter_by_brand');
    if (search === null) throw new Error('Something wrong with #search');
    if (sortSelect === null) throw new Error('Something wrong with #sort');
    if (reset === null) throw new Error('Something wrong with #reset');
    if (copy === null) throw new Error('Something wrong with #copy');
    if (catFilterList === null) throw new Error('Something wrong with #filter_by_cat input');
    if (catFilterList === null) throw new Error('Something wrong with #filter_by_brand input');

    //by brand
    brandFilterList.addEventListener('click', (e) => {
      const el = e.target as HTMLElement;
      const elRoot: HTMLInputElement | null = el.closest('input');
      if (elRoot === null) return;

      elRoot.setAttribute('checked', String(elRoot.checked));      
      data.filteredBrands = [];
      for (const i of mainFilterBrandList) {
        if (i.getAttribute('checked') === "true" && i.dataset.filter) data.filteredBrands.push(i.dataset.filter);
      }

      [data, this.sortedList] = this.filterListService.fillSortedList(data, this.rootList);
      data = this.urlService.fillUrl(data);
      this.filterListService.fillCounts(this.sortedList);
    });

    //by cat
    catFilterList.addEventListener('click', (e) => {
      const el = e.target as HTMLElement;
      const elRoot: HTMLInputElement | null = el.closest('input');
      if (elRoot === null) return;

      elRoot.setAttribute('checked', String(elRoot.checked));      
      data.filteredCats = [];
      for (const i of mainFilterCatList) {
        if (i.getAttribute('checked') === "true" && i.dataset.filter) data.filteredCats.push(i.dataset.filter);
      }

      [data, this.sortedList] = this.filterListService.fillSortedList(data, this.rootList);
      data = this.urlService.fillUrl(data);
      this.filterListService.fillCounts(this.sortedList);
    });

    //by text
    search.addEventListener('input', () => {
      search.value = search.value.replace(/\W/, '');
      data.searchText = search.value;

      [data, this.sortedList] = this.filterListService.fillSortedList(data, this.rootList);
      data = this.urlService.fillUrl(data);
      this.filterListService.fillCounts(this.sortedList);
    });

    //sort
    sortSelect.addEventListener('change', () => {
      data.sortSelect = sortSelect.value;

      [data, this.sortedList] = this.filterListService.fillSortedList(data, this.rootList);
      data = this.urlService.fillUrl(data);
      this.filterListService.fillCounts(this.sortedList);
    })

    //reset button
    reset.addEventListener('click', () => {

      for (const i of mainFilterCatList) {
        i.setAttribute('checked', "false");
        i.checked = false;
      }

      for (const i of mainFilterBrandList) {
        i.setAttribute('checked', "false");
        i.checked = false;
      }

      sortSelect.value = '';
      search.value = '';

      data.sortSelect = '';
      data.searchText = '';
      data.filteredCats = [];
      data.filteredBrands = [];
      data.view = 'tiles';

      data.maxPriceVal = 0;
      data.minPriceVal = 0;
      data.maxStockVal = 0;
      data.minStockVal = 0;
      this.sliderPrice.fillCounts('price', data.minPrice, data.maxPrice);
      this.sliderStock.fillCounts('stock', data.minStock, data.maxStock);
      this.sliderPrice.setVals(data.minPrice, data.maxPrice)
      this.sliderStock.setVals(data.minStock, data.maxStock)


      history.pushState({}, '', '/');
      [data, this.sortedList] = this.filterListService.fillSortedList(data, this.rootList);
      data = this.urlService.fillUrl(data);
      this.filterListService.fillCounts(this.sortedList);

    })

    //copy
    copy.addEventListener('click', (): void => {
        let url = '';
        url += window.location.protocol + '//';
        url += window.location.host;
        url += window.location.pathname;
        url += window.location.search;

        try {
          navigator.clipboard.writeText(url);
          copy.disabled = true;
        } catch(e) {
          console.log('Failed to copy: Browser do not have permission for clipboard');
        }
    });
    
    return data;

  }

  private cardListener(): void | never {
    const body: HTMLElement | null = document.getElementById('main__filter-body');
    if (body === null) throw new Error('something wrong with #main__filter-body');
    
    body.addEventListener('click', (e) => {
      const elem = e.target as HTMLElement | null;
      if (elem === null) return;
      let card: HTMLElement | null = elem.closest('.card');
      if(card === null)  card = elem.closest('.cardList');
      if(elem.closest(".buy")){
        const addBasketWindow = new AddBasketWindow
        addBasketWindow.addToBasket(Number(card?.dataset.id));
      }else{
        // const card: HTMLElement | null = elem.closest('.card');
      if (card === null) return;

      window.location.href = `/product?id=${card.dataset.id}`;
      }
      
    })
  }

  private logoListener(): void | never {
    const logo: HTMLElement | null = document.querySelector('.gitLogo');
    if (logo === null) throw new Error('something wrong with .gitLogo');
    logo.addEventListener('click', () => {
        window.open('https://github.com/Folganoid', '_blank');
      }
    )
  }

}

const filterCatList = document.querySelector(".main__filter-cat-list") as HTMLElement;
const filterBrandList  = document.querySelector(".main__filter-brand-list") as HTMLElement;

const categoryFilterButton: HTMLElement | null = document.querySelector(".categoryFilterButton");
categoryFilterButton?.addEventListener("click", () => { filterCatList.classList.toggle("hideList")})
const brandFilterButton: HTMLElement | null = document.querySelector(".brandFilterButton");
brandFilterButton?.addEventListener("click", ()=>{filterBrandList.classList.toggle("hideList")})