import BasketHandler from "./handlers/BasketHandler";
import MainHandler from "./handlers/MainHandler";
import ProductHandler from "./handlers/ProductHandler";
import X404Handler from "./handlers/X404Handler";
import ErrorHandler from "./handlers/ErrorHandler";

declare global {
  interface Window {
      route: Route["route"];
  }
}

export default class Route {
  private routes = {
    404: "temp_404",
    "/": "temp_home",
    "/product": "temp_product",
    "/basket": "temp_basket",
  };

  private handlers = {
    404: new X404Handler(),
    "/": new MainHandler(),
    "/product": new ProductHandler(),
    "/basket": new BasketHandler(),
  };

  public start(): void {
    const routesClass: NodeListOf<HTMLElement> = document.querySelectorAll(".route");
    for (const i of routesClass) {
      i.addEventListener("onclick", this.route);
    }

    window.onpopstate = this.handleLocation;
    window.route = this.route;

    this.handleLocation();
  }

  private route(event: Event): void {
    event = event || window.event;
    event.preventDefault();
    const eventTarget = event.target as HTMLAreaElement;
    if (eventTarget !==  null) {
      window.history.pushState({}, "", eventTarget.href);
      this.handleLocation();
    }
  }

  //show template
  private handleLocation(): void {
    const path: string = window.location.pathname;
    let route: string; 
    if (
         path === "/" 
         || path === "/product"
         || path === "/basket"
       ) {
      route = this.routes[path];
    } else {
      route = this.routes[404];
    }

    const template: HTMLElement | null = document.getElementById(route);
    if (template === null) {
      throw new Error(`something wrong with #${route}`);
    }

    const mainTemplates: NodeListOf<HTMLElement> = document.querySelectorAll(".main-template");
    for (const i of mainTemplates) {
      i.style.display = "none";
    }    
    template.style.display = "block";

    //start handler
    let handler: void | Error;
    if (
      path === "/" 
      || path === "/product"
      || path === "/basket"
    ) {
      handler = this.handlers[path].init();
    } else {
      handler = this.handlers[404].init();
    }

    (new ErrorHandler()).errorHandler(handler)
  }
}
