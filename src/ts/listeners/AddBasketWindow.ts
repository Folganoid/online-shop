// import { basketItem } from "../interfaces/Common";
import LocalStorageService from "../services/LocalStorageService";

export default class AddBasketWindow {
  public addToBasket(newId:number) {
    let flag = false;
    const localStorageService = new LocalStorageService();
    const basket = localStorageService.getAll();
    basket.forEach((el)=>{
      if(el.id === newId) flag = true;
      const buyButton = document.querySelector(".buyButton") as HTMLElement;
      if(buyButton){
        buyButton.classList.add("btnOff");
        buyButton.textContent = "BOUGHT"
      }
    })
    if(!flag){
      localStorageService.add(newId);
    this.showSelectionWindow();
    }
  }

  public showSelectionWindow() {
    const main = document.querySelector(".main") as HTMLElement;
    const modalBack = document.createElement("div");
    const modalWindow = document.createElement("div");
    const modalText = document.createElement("p");
    const modalBtnContainer = document.createElement("div");
    const linkYes = document.createElement("a")
    const modalBtnYes = document.createElement("div");
    const modalBtnNo = document.createElement("div");
    linkYes.className = "route";
    linkYes.href = "/basket";
    modalBack.className = "modalBack";
    modalWindow.className = "modalWindow";
    modalText.className = "modalText";
    modalBtnContainer.className = "modalBtnContainer";
    modalBtnYes.className = "modalBtnYes modalBtn";
    modalBtnNo.className = "modalBtnNo modalBtn";
    modalText.textContent =
      "The product has been successfully added to the basket. Would you like to proceed to checkout?";
    modalBtnYes.textContent = "YES";
    modalBtnNo.textContent = "NO";
    linkYes.append(modalBtnYes)
    modalBtnContainer.append(linkYes, modalBtnNo);
    modalWindow.append(modalText, modalBtnContainer);
    modalBack.append(modalWindow);
    main.append(modalBack);
    modalBack.addEventListener("click", ()=>{
      main.removeChild(modalBack);
      window.location.reload();
    })
  }

}
