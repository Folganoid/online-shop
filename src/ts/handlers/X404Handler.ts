import HeaderService from "../services/HeaderService";

export default class X404Handler {

  private headerService = new HeaderService();

    public init(): void | Error {
      
      try {

        this.headerService.fillBasketItems();
        this.headerService.fillPrice();  
          
      } catch (err) {
        return err as Error;
      }
    }
  }