import {IbasketData, basketItem} from '../interfaces/Common';
import BasketService from '../services/BasketService';
import BasketRender from '../services/BasketRender';
import UrlService from '../services/UrlService';
import jsonDisc from "../../data/discounts.json";
import json from "../../data/data.json";
import LocalStorageService from '../services/LocalStorageService';
import HeaderService from '../services/HeaderService';

export default class BasketHandler {

  private urlService =  new UrlService();
  private basketService = new BasketService();
  private basketRender = new BasketRender();
  private storage: basketItem[] = [];
  private localStorageService = new LocalStorageService();
  private headerService = new HeaderService();

  private basketData: IbasketData = {
    discounts: [],
    page: 1,
    limit: 0,
    url: '',
  }

  public init(): void | Error {

    try {

      this.basketData = this.urlService.parseBasketURL(this.basketData);
      this.storage = this.localStorageService.getAll();
      if (this.storage instanceof Error) throw this.storage;

      this.basketRender.renderBasketProducts(this.storage, this.basketData);
      if (this.storage.length === 0) {
        this.headerService.fillBasketItems();
        this.headerService.fillPrice();
        return;
      }

      this.basketService.fillControl(this.basketData);
      this.basketRender.renderDiscountList(this.basketData);

      this.controlListener();
      this.discountListener();
      this.basketService.fillPrice(this.basketData);

      this.cardListener();

      this.headerService.fillBasketItems();
      this.headerService.fillPrice();
      
      this.modalListener();

      this.basketService.personalValidation();
      this.basketService.cardValidation();
      
    } catch (err) {
      return err as Error;
    }
  }

  private controlListener(): void | never {
    const basketLimit = document.getElementById('basket_limit') as HTMLSelectElement | null;
    if (!basketLimit) throw new Error('something wrong with #basket_limit');

    const pagePrev: HTMLElement | null = document.getElementById('basket_page_prev');
    if (!pagePrev) throw new Error('something wrong with #basket_page_prev');

    const pageReset: HTMLElement | null = document.getElementById('basket_page_reset');
    if (!pageReset) throw new Error('something wrong with #basket_page_reset');

    const pageNext: HTMLElement | null = document.getElementById('basket_page_next');
    if (!pageNext) throw new Error('something wrong with #basket_page_next');

    const addDiscBtn: HTMLElement | null = document.getElementById('basket_add_disc');
    if (!addDiscBtn) throw new Error('something wrong with #basket_add_disc');

    const addDiscInp = document.getElementById('basket_disc_input') as HTMLInputElement | null;
    if (!addDiscInp) throw new Error('something wrong with #basket_disc_input');

    //page next
    pageNext.addEventListener('click', () => {
      if (
        this.localStorageService.getAll().length > 0 
        && this.basketData.limit !== 0 
        && this.basketData.page < Math.ceil(this.localStorageService.getAll().length / this.basketData.limit)
      ) this.basketData.page++;
      this.basketRender.renderBasketProducts(this.storage, this.basketData);
      this.basketService.fillControl(this.basketData);
      this.basketData = this.urlService.filBasketlUrl(this.basketData);

    });

    //page prev
    pagePrev.addEventListener('click', () => {
      if (this.basketData.page > 1) this.basketData.page--;
      this.basketRender.renderBasketProducts(this.storage, this.basketData);
      this.basketService.fillControl(this.basketData);
      this.basketData = this.urlService.filBasketlUrl(this.basketData);
    })

    //page reset
    pageReset.addEventListener('click', () => {
          this.basketData.limit = 0;
          this.basketData.page = 1;
          this.basketData.discounts = [];

          this.basketRender.renderBasketProducts(this.storage, this.basketData);
          this.basketService.fillControl(this.basketData);
          this.basketData = this.urlService.filBasketlUrl(this.basketData);
          this.basketRender.renderDiscountList(this.basketData);
          this.basketService.fillPrice(this.basketData);
    })

    //limit
    basketLimit.addEventListener('change', () => {
      this.basketData.limit = +basketLimit.value;
      this.basketRender.renderBasketProducts(this.storage, this.basketData);
      this.basketService.fillControl(this.basketData);
      this.basketData = this.urlService.filBasketlUrl(this.basketData);
    })

    //add disc
    addDiscBtn.addEventListener('click', () => {

      for (const i of jsonDisc) {
        if (i.code === addDiscInp.value.trim() && !this.basketData.discounts.includes(i.code)) {
          this.basketData.discounts.push(i.code);
          addDiscInp.value = '';
        }
      }

      this.basketRender.renderDiscountList(this.basketData);
      this.basketData = this.urlService.filBasketlUrl(this.basketData);
      this.basketService.fillPrice(this.basketData);
    });
  }

  private discountListener(): void | never {

    const basketDiscountList = document.getElementById('basket_discount_list') as HTMLElement | null;
    if (!basketDiscountList) throw new Error('something wrong with #basket_discount_list');

    basketDiscountList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (target && target.dataset.id) {
        this.basketData.discounts = this.basketData.discounts.filter(e => e !== target.dataset.id)
      }

      this.basketRender.renderDiscountList(this.basketData);
      this.basketData = this.urlService.filBasketlUrl(this.basketData);
      this.basketService.fillPrice(this.basketData);
    })
  }

  public cardListener(): void | never {
    const basketList = document.getElementById('basket_list') as HTMLElement | null;
    if (!basketList) throw new Error('something wrong with #basket_list');

    basketList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      //remove
      if (target.closest('.basket__card-remove')) {
        if (!target.dataset.id) return;
        for(let i = 0; i < this.storage.length; i++ ) {
          if (this.storage[i].id === +target.dataset.id) {
            this.storage[i].count = 0;
            break;
          }
        }
        this.storage = this.storage.filter(e => e.count > 0);

      //+  
      } else if (target.closest('.basket__card-count-up')) {
        if (!target.dataset.id) return;
        for(let i = 0; i < this.storage.length; i++ ) {
          if (this.storage[i].id === +target.dataset.id) {
            for (const z of json.products) {
              if (this.storage[i].id === z.id) {
                if (z.stock > +this.storage[i].count) {
                  this.storage[i].count++;
                } 
              }
            }
            break;
          }
        }
      // -  
      } else if (target.closest('.basket__card-count-low')) {
        if (!target.dataset.id) return;
        for(let i = 0; i < this.storage.length; i++ ) {
          if (this.storage[i].id === +target.dataset.id) {
            this.storage[i].count--;
            break;
          }
        }
        this.storage = this.storage.filter(e => e.count > 0);

      //redirect  
      } else if (target.closest('.basket__card')) {
        const card: HTMLElement | null = target.closest('.basket__card');
        if (card) {
          window.location.href = `/product?id=${card.dataset.id}`;
        }
      }

      localStorage.setItem('basket', JSON.stringify(this.storage));

      this.storage = this.localStorageService.getAll();
      this.basketRender.renderBasketProducts(this.storage, this.basketData);
      if (this.storage.length === 0) {
        this.headerService.fillBasketItems();
        this.headerService.fillPrice();
        return;
      }
      this.basketService.fillControl(this.basketData);
      this.basketService.fillPrice(this.basketData);
      this.basketData = this.urlService.filBasketlUrl(this.basketData);

      this.headerService.fillBasketItems();
      this.headerService.fillPrice();    
    })

  }

  private modalListener(): void | never {
    const modalBlock = document.getElementById('basket_modal') as HTMLSelectElement | null;
    if (!modalBlock) throw new Error('something wrong with #basket_modal');

    const sendBtn = document.getElementById('basket_send') as HTMLSelectElement | null;
    if (!sendBtn) throw new Error('something wrong with #basket_send');

    const confirmBtn = document.getElementById('form_confirm') as HTMLButtonElement | null;
    if (!confirmBtn) throw new Error('something wrong with #form_confirm');

    sendBtn.addEventListener('click', () => {
      modalBlock.style.display = 'flex';
    })

    modalBlock.addEventListener('click', (e) => {

      const target = e.target as HTMLElement | null;
      if (target === null) return;

      //close
      if (target.classList.contains('basket__modal') || target.classList.contains('basket__cancel_btn')) {
        modalBlock.style.display = 'none';
      }

    });

    confirmBtn.addEventListener('click', () => {

      const conf = document.getElementById('conf');
      if (!conf) throw new Error('Something wrong with #conf');
      const cnt = document.getElementById('conf_sec');
      if (!cnt) throw new Error('Something wrong with #conf_sec');

      conf.style.visibility = 'visible';

      this.localStorageService.clean();
      setTimeout(() => {
        cnt.innerHTML = "2";
      }, 1000);
      setTimeout(() => {
        cnt.innerHTML = "1";
      }, 2000);
      setTimeout(() => {
        cnt.innerHTML = "0";
        window.location.href = '/';
      }, 3000);
    });
  }
}
