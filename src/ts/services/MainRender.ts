import { IProduct } from "../interfaces/Common";
import ViewTypes from "../listeners/ViewTypes";
// import AddBasketWindow from "../listeners/AddBasketWindow";
import FilterListService from "./FilterListService";
import LocalStorageService from "./LocalStorageService";

export default class MainRender {
  private localStorageService = new LocalStorageService();

  public renderFilterList(
    brandList: { [key: string]: number },
    catList: { [key: string]: number }
  ): void | never {
    const brandElem: HTMLElement | null =
      document.getElementById("filter_by_brand");
    const catElem: HTMLElement | null =
      document.getElementById("filter_by_cat");

    if (brandElem === null)
      throw new Error("something wrong with #filter_by_brand");
    if (catElem === null)
      throw new Error("something wrong with #filter_by_cat");

    let brandStr = "";
    let catStr = "";

    for (const i in brandList) {
      const temp = `
          <li>
            <input type="checkbox" class = "checkBox" id = "brand${i}" name="brand" data-filter="${FilterListService.slug(
        i
      )}"> 
            <label for="brand${i}">${i}: <span></span></label>
          </li>

          `;
      brandStr += temp.trim();
    }

    for (const i in catList) {
      const temp = `
          <li class = "catListItem">
            <input type="checkbox" class = "checkBox" id = "category${i}" name="category" data-filter="${FilterListService.slug(
        i
      )}"> 
            <label for="category${i}">${i}: <span></span></label>
          </li>

          `;
      catStr += temp.trim();
    }

    brandElem.innerHTML = brandStr;
    catElem.innerHTML = catStr;
  }

  public renderSortedProducts(
    sortedList: IProduct[],
    view: string
  ): void | never {
    const viewTypes = new ViewTypes();
    const body: HTMLElement | null =
      document.getElementById("main__filter-body");
    if (body === null)
      throw new Error("something wrong with #main__filter-body");

    body.innerHTML = "";

    for (const i of sortedList) {
      const elem: HTMLElement = this.buildCard(i, view);
      body.append(elem);
      viewTypes.createListView(elem);
    }

    //no product found
    if (sortedList.length === 0) {
      body.innerHTML = `
            <div class="main__empty btnOne">
              <h1 class = "emptyText">Unfortunately, we didn't find anything according to your request. But you can try again by clicking on the reset button.</h1>
            </div>
          `;
    }
  }

  private buildCard(product: IProduct, view: string): HTMLElement {
    let isInBasket = false;

    for (const i of this.localStorageService.getAll()) {
      if (i.id === product.id) {
        isInBasket = true;
        break;
      }
    }

    const res = `
          <div class="card" id="card_${product.id}" data-id="${product.id}">
            <h4 class = "cardTitle">${product.title}</h4>
            <p class = "brandName">${product.brand}</p>
            <b class ="price btnOne">${product.price} ₴</b>
            <div class = "btnOne ${isInBasket ? "bought" : "buy"}" id = "buy_${
      product.id
    }">${isInBasket ? "BOUGHT" : "BUY"}</div>
            <div class = "imgWrapper">
              <img class = "cardImg" src="${product.thumbnail}" alt="${
      product.title
    }">
            </div>
          </div>
        `;
    const selectView = document.querySelector("#viewType") as HTMLSelectElement;
    selectView.value = view;

    const div: HTMLElement = document.createElement("div");
    div.innerHTML = res.trim();
    const elem = div.firstChild as HTMLElement;
    return elem;
  }


}
