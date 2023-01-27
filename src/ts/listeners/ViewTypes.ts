export default class ViewTypes{
  public createListView(elem: HTMLElement){
    const select = document.querySelector("#viewType") as HTMLSelectElement;
    if(select.value === "list"){
      elem.classList.replace("card", "cardList");
    }
  
  }
}