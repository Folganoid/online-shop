import json from "../../data/data.json";
import jsonDisc from "../../data/discounts.json";
import {IbasketData, IProduct, basketItem} from '../interfaces/Common';

export default class BasketRender {
  
    public renderBasketProducts(storage: basketItem[], data: IbasketData): void | never {
        const basketList: HTMLElement | null = document.getElementById('basket_list');
        if (!basketList) throw new Error('Something wrong with #basket_list');

        let cnt = 1;
        let cntInPage = 0;

        basketList.innerHTML = '';

        for (const i of storage) {
            for (const z of json.products) {
                if (z.id === i.id) {
                  if (
                    data.limit !== 0 
                    &&cnt > data.limit * (data.page-1) 
                    && cntInPage < data.limit
                  )  {
                    basketList.append(this.buildCard(z, cnt, i.count));
                    cntInPage++;

                  } else if (data.limit === 0 ){
                    basketList.append(this.buildCard(z, cnt, i.count));
                    cntInPage++;
                  }
                  cnt++;
                }
            }
        }

        if (storage.length > 0 && cntInPage === 0 && data.page > 1) {
            data.page--;
            this.renderBasketProducts(storage, data);
        }

        if (data.limit === 0) data.page = 1;

        if (storage.length === 0) {
          const basket: HTMLElement | null = document.getElementById('basket');
          if (basket) {
            basket.innerHTML = `
              <div class = "emptyBasket btnOne">
                <h1>Oops! Have you really decided to deprive your pet?</h1>
              </div>
            `
          }
        }
    }

    private buildCard(product: IProduct, index: number, sum: number): HTMLElement {
        const res = `
          <div class="basket__card" id="basket_card_${product.id}" data-id="${product.id}">
            <div class="basket__card-num">
                <p>${index}</p>
            </div>
            <div class="basket__card-desc">
              <div class = "imgBaskWrap">
                <img class = "basket__card-img" src="${product.thumbnail}" alt="${product.title}">
              </div>
              <div class="basket__card-info">
                <h4 class = "basket__card-title">${product.title}</h4>
                <div class = "basket__card-des">
                  <p class = "basket__card-description"><b>${product.description}</b></p>
                  <p>Category: ${product.category}</p>
                  <p>Brand: ${product.brand}</p>
                  <p>Rating: <span class="stars">✭✭✭✭</span> ${product.rating}</p>
                </div>
              </div>
            </div>
            <div class="basket__card-counter">
                <button class="basket__card-remove" data-id="${product.id}">X</button>
                <p class = "basket__card-stock">Stock: ${product.stock}</p>
                <div class="basket__card-count">
                  <button class="basket__card-count-low" data-id="${product.id}">-</button>
                  <p class="basket__card-count-total" data-id="${product.id}">${sum}</p>
                  <button class="basket__card-count-up" data-id="${product.id}">+</button>
                </div>
                <p class="basket__card-price">Price: <b>${product.price * sum} ₴</b></p>
            </div>
          </div>
        `
        const div: HTMLElement = document.createElement('div');
        div.innerHTML = res.trim();
        const elem = div.firstChild as HTMLElement;
        return elem;    
    }

    public renderDiscountList(data: IbasketData): void | never {

        const basketList: HTMLElement | null = document.getElementById('basket_discount_list');
        if (!basketList) throw new Error('Something wrong with #basket_discount_list');

        basketList.innerHTML = '';

        for (const i of data.discounts) {
            for (const z of jsonDisc) {
                if (i === z.code) {
                    basketList.append(this.buildDiscountLI(z.alias, z.code));
                }
            }
        }
    }

    private buildDiscountLI(alias: string, code: string): HTMLElement {
        const res = `
          <div class="basket__discount">
            <p>${code}: <span>${alias}</span></p>
            <button data-id="${code}">X</button>
          </div>
        `
        const div: HTMLElement = document.createElement('div');
        div.innerHTML = res.trim();
        const elem = div.firstChild as HTMLElement;
        return elem;  
    }
}