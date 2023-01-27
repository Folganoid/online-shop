import { basketItem } from "../interfaces/Common";
import json from "../../data/data.json";

export default class LocalStorageService {
  
  public add(newId: number): void {
    let basket: basketItem[] = [];
    let flag = false;
    if (localStorage.getItem("basket")) {
      basket = JSON.parse(localStorage.getItem("basket") as string);
      basket.forEach((item) => {
        if (item.id === newId) {
          item.count += 1;
          localStorage.setItem("basket", JSON.stringify(basket));
          flag = true;
          return;
        }
      });
    }
    if (!flag) {
      const obj = { id: newId, count: 1 };
      basket.push(obj);
      localStorage.setItem("basket", JSON.stringify(basket));
    }
  }

  public remove(id: number): void {
    let basket: basketItem[] = [];
    let flag = false;
    if (localStorage.getItem("basket")) {
      basket = JSON.parse(localStorage.getItem("basket") as string);
      for (const item of basket) {
        if (item.id === id && item.count > 1) {
          item.count -= 1;
          localStorage.setItem("basket", JSON.stringify(basket));
          flag = true;
          return;
        }
      }
      if (!flag) {
        const bask = basket.filter((item) => item.id !== id);
        localStorage.setItem("basket", JSON.stringify(bask));
      }
    } else {
      alert("There is nothing in your basket but a web");
    }
  }

  public getAll(): basketItem[] {
    if (localStorage.getItem("basket")) {
      const basket = JSON.parse(localStorage.getItem("basket") as string);
      if (basket.length === 0) {
        return [] as basketItem[];
      } else {
        return JSON.parse(
          localStorage.getItem("basket") as string
        ) as basketItem[];
      }
    }
    return [] as basketItem[];
  }

  public clean(): void {
    localStorage.setItem("basket", JSON.stringify([]));
  }

  public getTotalPrice(): number {
    let sum = 0;
    let basket: basketItem[] = [];
    if (localStorage.getItem("basket")) {
      basket = JSON.parse(localStorage.getItem("basket") as string);
    }
    json.products.forEach(function (i) {
      basket.forEach(function (k) {
        if (i.id === k.id) sum += i.price * k.count;
      });
    });
    return sum;
  }
}
