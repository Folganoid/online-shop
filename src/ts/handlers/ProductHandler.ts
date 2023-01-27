import json from "../../data/data.json";
import HeaderService from "../services/HeaderService";
import ProductRender from "../services/ProductRender";
import UrlService from "../services/UrlService";

export default class ProductHandler {
  private productId = 0;
  private urlService = new UrlService();
  private productRender = new ProductRender();
  private headerService = new HeaderService();

  public init(): void | Error {

    try {

      this.productId = this.urlService.getUrlVar("id");
      const elem: HTMLElement = this.productRender.buildTemplate(
        this.productId,
        json
      );
      this.productRender.renderTemplate(elem);

      this.headerService.fillBasketItems();
      this.headerService.fillPrice();  
        
    } catch (err) {
      return err as Error;
    }
  }
}
