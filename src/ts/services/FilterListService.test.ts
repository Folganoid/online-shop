import { JSDOM } from "jsdom"
import { IProduct } from "../interfaces/Common";
import FilterListService from "./FilterListService";
import MainRender from "./MainRender";
import SliderService from "./SliderService";

//mock document
const dom = new JSDOM('<!DOCTYPE html>');
global.document = dom.window.document;

//mock window
Object.defineProperty(global, 'window', {
    value: dom.window,
});

jest.spyOn(MainRender.prototype, 'renderFilterList').mockImplementation();
jest.spyOn(MainRender.prototype, 'renderSortedProducts').mockImplementation();

describe ('FilterListService tests', () => {

  test('test fillRootList()', () => {

    const json = {"products": [
      {
        id: 1,
        title: "test1",
        description: "desc1",
        price: 9.99,
        discountPercentage: 100,
        rating: 1,
        stock: 10,
        brand: "alpha",
        category: "cat1",
        thumbnail: "http://img1.aaa",
        images: ["http://img2.aaa", "http://img3.aaa"]
      },
      {
        id: 2,
        title: "test2",
        description: "desc2",
        price: 10.00,
        discountPercentage: 50,
        rating: 2,
        stock: 20,
        brand: "beta",
        category: "cat1",
        thumbnail: "http://img1.bbb",
        images: ["http://img2.bbb", "http://img3.bbb"]
      },
      {
        id: 3,
        title: "test3",
        description: "desc3",
        price: 25.50,
        discountPercentage: 75,
        rating: 3,
        stock: 30,
        brand: "beta",
        category: "cat2",
        thumbnail: "http://img1.ccc",
        images: ["http://img2.ccc", "http://img3.ccc"]
      }
    ]};

    let data = {
      filteredBrands: [""],
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
      url: "",
    }

    let sortedList: IProduct[] = []; 
    const slider = {} as SliderService;
    slider.fillCounts = () => undefined;
    slider.setVals = () => undefined;
    slider.setEdges = () => undefined;
    const filterListService = new FilterListService(slider, slider);

    [sortedList, data] = filterListService.fillRootList(json, data, slider, slider);

    expect(data.minPrice).toEqual(9.99);
    expect(data.maxPrice).toEqual(25.50);
    expect(data.minStock).toEqual(10);
    expect(data.maxStock).toEqual(30);
    expect(sortedList.length).toEqual(3);
  });

  test('test fillSortedList()', () => {

    const rootList = [
      {
        id: 1,
        title: "test1",
        description: "desc1",
        price: 9.99,
        discountPercentage: 100,
        rating: 1,
        stock: 10,
        brand: "alpha",
        category: "cat1",
        thumbnail: "http://img1.aaa",
        images: ["http://img2.aaa", "http://img3.aaa"]
      },
      {
        id: 2,
        title: "test2",
        description: "desc2",
        price: 10.00,
        discountPercentage: 50,
        rating: 2,
        stock: 20,
        brand: "beta",
        category: "cat1",
        thumbnail: "http://img1.bbb",
        images: ["http://img2.bbb", "http://img3.bbb"]
      },
      {
        id: 3,
        title: "test3",
        description: "desc3",
        price: 25.50,
        discountPercentage: 75,
        rating: 3,
        stock: 30,
        brand: "beta",
        category: "cat2",
        thumbnail: "http://img1.ccc",
        images: ["http://img2.ccc", "http://img3.ccc"]
      }
    ];

    let data = {
      filteredBrands: ["alpha", "beta"],
      filteredCats: ['cat1', 'cat2'],
      searchText: "desc",
      sortSelect: "priceDesc",
      minPrice: 0,
      maxPrice: 0,
      minPriceVal: 0,
      maxPriceVal: 0,
      minStock: 0,
      maxStock: 0,
      minStockVal: 0,
      maxStockVal: 0,
      view: "",
      url: "",
    }

    let sortedList = JSON.parse(JSON.stringify(rootList));

    const slider = {} as SliderService;
    slider.fillCounts = () => undefined;
    slider.setVals = () => undefined;
    const filterListService = new FilterListService(slider, slider);

    [data, sortedList] = filterListService.fillSortedList(data, rootList);

    expect(sortedList.length).toEqual(3);
    expect(sortedList[0].id).toEqual(3);
    expect(sortedList[2].id).toEqual(1);

    data.filteredBrands = ["beta"];
    data.sortSelect = 'ratingDesc';
    [data, sortedList] = filterListService.fillSortedList(data, rootList);

    expect(sortedList.length).toEqual(2);
    expect(sortedList[0].id).toEqual(3);
    expect(sortedList[1].id).toEqual(2);

    data.filteredBrands = [];
    data.sortSelect = '';
    data.searchText = "desc3";
    [data, sortedList] = filterListService.fillSortedList(data, rootList);

    expect(sortedList.length).toEqual(1);
    expect(sortedList[0].id).toEqual(3);

  });

  test('test fillFilterList()', () => {

    const rootList = [
      {
        id: 1,
        title: "test1",
        description: "desc1",
        price: 9.99,
        discountPercentage: 100,
        rating: 1,
        stock: 10,
        brand: "alpha",
        category: "cat1",
        thumbnail: "http://img1.aaa",
        images: ["http://img2.aaa", "http://img3.aaa"]
      },
      {
        id: 2,
        title: "test2",
        description: "desc2",
        price: 10.00,
        discountPercentage: 50,
        rating: 2,
        stock: 20,
        brand: "beta",
        category: "cat1",
        thumbnail: "http://img1.bbb",
        images: ["http://img2.bbb", "http://img3.bbb"]
      },
      {
        id: 3,
        title: "test3",
        description: "desc3",
        price: 25.50,
        discountPercentage: 75,
        rating: 3,
        stock: 30,
        brand: "beta",
        category: "cat2",
        thumbnail: "http://img1.ccc",
        images: ["http://img2.ccc", "http://img3.ccc"]
      }
    ];

    const slider = {} as SliderService;
    const filterListService = new FilterListService(slider, slider);

    filterListService.fillFilterList(rootList);

    expect(filterListService.brandList).toEqual({"alpha" : 1, "beta": 2});
    expect(filterListService.catList).toEqual({"cat1" : 2, "cat2": 1});

  });

  test('test slug()', () => {
    const s = FilterListService.slug("Alpha Beta-Charlie&Delta ECHO123");
    expect(s).toEqual('alphabetacharliedeltaecho123');
  });

});