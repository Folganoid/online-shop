import { IProduct, IProductList } from "../interfaces/Common";
import AddBasketWindow from "../listeners/AddBasketWindow";
import FilterListService from "./FilterListService";
import LocalStorageService from "../services/LocalStorageService";

export default class ProductRender {
  public renderTemplate(temp: HTMLElement): void | never {
    const body: HTMLElement | null = document.getElementById("temp_product");
    if (body === null) throw new Error("something wrong with #temp_product");
    body.innerHTML = "";
    body.append(temp);

    const fastBuy = document.querySelector(".fastBuy") as HTMLElement;
    fastBuy?.addEventListener("click", ()=>{localStorageService.add(newId)})
    const addBasketWindow = new AddBasketWindow();
    const buyButton = document.querySelector(".buyButton") as HTMLElement;
    const localStorageService = new LocalStorageService();
    const newId = Number(document.querySelector(".product-id")?.innerHTML);
    if (buyButton !== null) {
      let flag = false;
      const basket = localStorageService.getAll();
      basket.forEach((el)=>{
        if(el.id === newId){ 
          flag = true;
          buyButton.classList.add("btnOff");
          buyButton.textContent = "BOUGHT";
          fastBuy.style.display = "none";
      }
      })
      if(!flag){
        buyButton.addEventListener("click", () => {
          addBasketWindow.addToBasket(newId);
        });
      }
    }
    const thumbnail = document.querySelector(".product-thumbnail")
    const productImages = document.querySelector(".product-images");
    if(productImages?.hasChildNodes){
      const childArr = productImages.childNodes;
      childArr.forEach((elem)=>{
        const i = elem as HTMLImageElement
        elem.addEventListener("click", ()=>{
          thumbnail?.setAttribute("src", i.src)
        })
      })
    }

  }

  public buildTemplate(id: number, json: IProductList): HTMLElement {
    let data: IProduct | undefined;

    for (const i of json.products) {
      if (id !== 0 && i.id === id) {
        data = i;
        break;
      }
    }

    //unknown template
    let temp = `
          <div class="product__card">
            <strong>ERROR</strong>
            <p>Product not found !!!</p>
          </div>
        `;

    if (data !== undefined) {
      //fill images
      let images: string;
      images = "";
      for (const z of data.images) {
        images += `<img class="miniature" src="${z}" alt="${data.title}">`;
      }

      const oldPrice: number = Math.floor(
        data.price * (data.discountPercentage / 100 + 1)
      );

      const stars: string = `&#10029`.repeat(Math.round(data.rating));

      const br:string = FilterListService.slug(data.brand);
      const ct:string = FilterListService.slug(data.category);

      //valid template
      temp = `
          <div class="product">
          <ul class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Store >></a></li>
            <li class="breadcrumb-item "><a href="/?cat=${ct}">${ct} >></a></li>
            <li class="breadcrumb-item "><a href="/?cat=${ct}&brand=${br}">${br} >></a></li>
            <li class="breadcrumb-item active">${data.title}</li>
          </ul>
          <div class = "mainProdCont">
          <h2 class = "product-id">${data.id}</h2>
            <div class = "leftSect">
              <div class="product-images">
                ${images}
              </div>
              <div>
                <img class = "product-thumbnail" src="${data.thumbnail}" alt="thumbnail">
              </div>
            </div>
            <div class = "rightSect">
            <div class = "titleSect">
              <p class="product-title">${data.title}</p>
              <p class = "product-brand">${data.brand}</p>
            </div>
              <div class ="buySect">
                <div class = "priceSect">
                  <p class = "oldPrice">${oldPrice} ₴</p>
                  <p class = "product-price">${data.price} ₴</p>
                </div>
                <div class = "buyButton btnOne">Buy</div>
              </div>
              <p class = "product-description">${data.description}</p>
              <p class = "stars">${stars}</p>
              <p class = "product-rating">${data.rating}</p>
              <p class = "product-stock">stock balance: ${data.stock}</p>
              <a href = "/basket?buynow=${data.id}"><div class = "fastBuy">Buy in one and a half clicks</div></a>
            </div>
          </div>
          </div>
        `;
    }

    const div: HTMLElement = document.createElement("div");
    div.innerHTML = temp.trim();

    const elem = div.firstChild as HTMLElement;
    return elem;
  }
}
