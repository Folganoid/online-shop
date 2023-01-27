import LocalStorageService from "./LocalStorageService";

export default class HeaderService {

    private localStorageService = new LocalStorageService();

    public fillBasketItems(): void | never {
        const basketCnt = document.getElementById('header_items');
        if (basketCnt === null) throw new Error('Something wrong with #header_items');

        let sum = 0;
        const storage = this.localStorageService.getAll();
        for (const i of storage) {
            sum += i.count;
        }
        basketCnt.innerHTML = String(sum);
    }

    public fillPrice(): void | never {
        const headerPrice = document.getElementById('header_price');
        if (headerPrice === null) throw new Error('Something wrong with #header_price');

        const price = this.localStorageService.getTotalPrice();

        headerPrice.innerHTML = String(price) + " ₴";
    }
}