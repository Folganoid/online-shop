import { IbasketData, basketItem} from "../interfaces/Common";
import jsonDisc from "../../data/discounts.json";
import json from "../../data/data.json";
import LocalStorageService from "./LocalStorageService";


export default class BasketService {

    localStorageService = new LocalStorageService();
    isNameValid = false;
    isAddressValid = false;
    isTelValid = false;
    isEmailValid = false;
    isCard1Valid = false;
    isCard2Valid = false;
    isCard3Valid = false;
    isCard4Valid = false;
    isDayValid = false;
    isMonthValid = false;
    isCvvValid = false;


    public fillControl(data: IbasketData): void | never {
        const basketLimit = document.getElementById('basket_limit') as HTMLSelectElement | null;
        if (!basketLimit) throw new Error('something wrong with #basket_limit');
    
        const pageCur: HTMLElement | null = document.getElementById('basket_page_cur');
        if (!pageCur) throw new Error('something wrong with #basket_page_cur');
    
        const pageTotal: HTMLElement | null = document.getElementById('basket_page_total');
        if (!pageTotal) throw new Error('something wrong with #basket_page_total');

        basketLimit.value = String(data.limit);
        pageCur.innerHTML = String(data.page);

        if (this.localStorageService.getAll().length > 0 && data.limit !== 0 && this.localStorageService.getAll().length > data.limit) {
            pageTotal.innerHTML = String(Math.ceil(this.localStorageService.getAll().length / data.limit));
        } else {
            pageTotal.innerHTML = "1";
        }
    }

    public fillPrice(data: IbasketData): void | never {
        const totalPriceElem = document.getElementById('basket_total_price') as HTMLElement | null;
        if (!totalPriceElem) throw new Error('something wrong with #basket_total_price');

        const discPriceElem = document.getElementById('basket_discount_price') as HTMLElement | null;
        if (!discPriceElem) throw new Error('something wrong with #basket_discount_price');

        const basketItems = document.getElementById('basket_items') as HTMLElement | null;
        if (!basketItems) throw new Error('something wrong with #basket_items');

        const basketItems2 = document.getElementById('basket_items2') as HTMLElement | null;
        if (!basketItems2) throw new Error('something wrong with #basket_items2');

        let coef = 1;
        let totalItems = 0;
        for (const i of data.discounts) {
            for (const z of jsonDisc) {
                if (i === z.code) coef -= z.coefficient;
            }
        }

        let totalPrice = 0;
        let discPrice = 0;
        const storage: basketItem[] = this.localStorageService.getAll();

        for (const i of storage) {
            for (const z of json.products) {
                if (i.id === z.id) {
                    totalPrice += z.price * i.count;
                    totalItems += i.count;
                }
            }
        }

        discPrice = totalPrice * coef;

        if (discPrice === totalPrice) {
            discPriceElem.parentElement?.classList.add('hide');
            totalPriceElem.parentElement?.classList.remove('cross');
        } else {
            totalPriceElem.parentElement?.classList.add('cross');
            discPriceElem.parentElement?.classList.remove('hide');
        }

        basketItems.innerHTML = `for ${totalItems} items`;
        basketItems2.innerHTML = `for ${totalItems} items`;

        totalPriceElem.innerHTML = String(totalPrice.toFixed(2)) + " ₴";
        discPriceElem.innerHTML = String(discPrice.toFixed(2)) + " ₴";

    }

    public personalValidation(): void | never {

        const formName = document.getElementById('form_name') as HTMLElement | null;
        if (!formName) throw new Error('something wrong with #form_name');
        const formNameStatus = document.getElementById('form_name_status') as HTMLElement | null;
        if (!formNameStatus) throw new Error('something wrong with #form_name_status');
        const formNameShow = document.getElementById('form_name_show') as HTMLElement | null;
        if (!formNameShow) throw new Error('something wrong with #form_name_show');

        const formAddress = document.getElementById('form_address') as HTMLElement | null;
        if (!formAddress) throw new Error('something wrong with #form_address');
        const formAddressStatus = document.getElementById('form_address_status') as HTMLElement | null;
        if (!formAddressStatus) throw new Error('something wrong with #form_address_status');

        const formTel = document.getElementById('form_tel') as HTMLElement | null;
        if (!formTel) throw new Error('something wrong with #form_tel');
        const formTelStatus = document.getElementById('form_tel_status') as HTMLElement | null;
        if (!formTelStatus) throw new Error('something wrong with #form_tel_status');

        const formEmail = document.getElementById('form_email') as HTMLElement | null;
        if (!formEmail) throw new Error('something wrong with #form_email');
        const formEmailStatus = document.getElementById('form_email_status') as HTMLElement | null;
        if (!formEmailStatus) throw new Error('something wrong with #form_email_status');

        //name
        formName.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const m = target.value.match(/([A-Za-z]{3,}\s[A-Za-z]{3,})/);
            if (m && m.length > 0) {
                formNameStatus.classList.remove('invalid');
                formNameStatus.classList.add('valid');
                this.isNameValid = true;
            } else {
                formNameStatus.classList.add('invalid');
                formNameStatus.classList.remove('valid');
                this.isNameValid = false;
            }
            if (target.value.length > 20) target.value = target.value.substring(0, 20);
            formNameShow.innerHTML = target.value.toUpperCase();
            this.checkAllFields();
        })

        //address
        formAddress.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const m = target.value.match(/(\S{5,}\s{1,}){2,}(\S{5,})+/gi);
            if (m && m.length > 0) {
                formAddressStatus.classList.remove('invalid');
                formAddressStatus.classList.add('valid');
                this.isAddressValid = true;
            } else {
                formAddressStatus.classList.add('invalid');
                formAddressStatus.classList.remove('valid');
                this.isAddressValid = false;
            }
            this.checkAllFields();
        })

        //tel
        formTel.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const m = target.value.match(/^\+[0-9]{9,}/);
            if (m && m.length > 0) {
                formTelStatus.classList.remove('invalid');
                formTelStatus.classList.add('valid');
                this.isTelValid = true;
            } else {
                formTelStatus.classList.add('invalid');
                formTelStatus.classList.remove('valid');
                this.isTelValid = false;
            }
            target.value = target.value.replace(/[^\d\+]/, "");
            if (target.value.length > 14) target.value = target.value.substring(0, 14);
            this.checkAllFields();
        })

        //email
        formEmail.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const m = target.value.match(/[a-zA-Z0-9_\-]+@[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]{2,}/g);
            if (m && m.length > 0) {
                formEmailStatus.classList.remove('invalid');
                formEmailStatus.classList.add('valid');
                this.isEmailValid = true;
            } else {
                formEmailStatus.classList.add('invalid');
                formEmailStatus.classList.remove('valid');
                this.isEmailValid = false;
            }
            this.checkAllFields();
        })
    }

    public cardValidation(): void | never {

        const master = document.getElementById('card_master') as HTMLElement | null;
        const visa = document.getElementById('card_visa') as HTMLElement | null;
        const express = document.getElementById('card_express') as HTMLElement | null;
        if (!master || !express || !visa ) throw new Error('something wrong with #card_XXX');

        const month = document.getElementById('form_month') as HTMLElement | null;
        const year = document.getElementById('form_year') as HTMLElement | null;
        const cvv = document.getElementById('form_cvv') as HTMLElement | null;
        if (!cvv || !year || !month ) throw new Error('something wrong with #form_XXX');

        const card1 = document.getElementById('card_num1') as HTMLElement | null;
        const card2 = document.getElementById('card_num2') as HTMLElement | null;
        const card3 = document.getElementById('card_num3') as HTMLElement | null;
        const card4 = document.getElementById('card_num4') as HTMLElement | null;
        if (!card1 || !card2 || !card3 || !card4) throw new Error('something wrong with #card_num1-4');


        card1.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value.length > 4) target.value = target.value.substring(0, 4);
            target.value = target.value.replace(/[^\d]/, "");
            if (target.value.length === 4) {
                card2.focus();
                this.isCard1Valid = true;
            } else {
                this.isCard1Valid = false;
            }

            if (target.value[0] === "4") {
                visa.classList.remove('hide');
                master.classList.add('hide');
                express.classList.add('hide');
            } else if (target.value[0] === "5") {
                visa.classList.add('hide');
                master.classList.remove('hide');
                express.classList.add('hide');
            } else {
                visa.classList.add('hide');
                master.classList.add('hide');
                express.classList.remove('hide');
            }
            this.checkAllFields();
            this.checkCardNum();
        })

        card2.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value.length > 4) target.value = target.value.substring(0, 4);
            target.value = target.value.replace(/[^\d]/, "");
            if (target.value.length === 4) {
                card3.focus();
                this.isCard2Valid = true;
            } else {
                this.isCard2Valid = false;
            }
            this.checkAllFields();
            this.checkCardNum();
        })

        card3.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value.length > 4) target.value = target.value.substring(0, 4);
            target.value = target.value.replace(/[^\d]/, "");
            if (target.value.length === 4) {
                card4.focus();
                this.isCard3Valid = true;  
            } else {
                this.isCard3Valid = false;  
            }
            this.checkAllFields();
            this.checkCardNum();
        })

        card4.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            if (target.value.length > 4) target.value = target.value.substring(0, 4);
            target.value = target.value.replace(/[^\d]/, "");
            if (target.value.length === 4) {
                this.isCard4Valid = true;  
            } else {
                this.isCard4Valid = false;  
            }
            this.checkAllFields();
            this.checkCardNum();
        })

        month.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/[^\d]/, "");
            if (target.value.length > 2) target.value = target.value.substring(0, 2);
            if (+target.value > 12) target.value = "12";
            if (+target.value > 0 && +target.value < 13) {
                this.isMonthValid = true;
            } else {
                this.isMonthValid = false;
            }
            if (target.value.length === 2) {
                year.focus();
            }
            this.checkAllFields();
            this.checkDateCvv();
        });

        year.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/[^\d]/, "");
            if (target.value.length > 2) target.value = target.value.substring(0, 2);
            if (+target.value > 30) target.value = "30";
            if (+target.value < 0) target.value = "23";
            if (+target.value > 22 && +target.value < 31) {
                this.isDayValid = true;
            } else {
                this.isDayValid = false;
            }
            this.checkAllFields();
            this.checkDateCvv();
        });

        cvv.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/[^\d]/, "");
            if (target.value.length >= 3) {
                this.isCvvValid = true;
            } else {
                this.isCvvValid = false;
            }
            if (target.value.length > 3) target.value = target.value.substring(0, 3);
            this.checkAllFields();
            this.checkDateCvv();
        });
    }

    public checkAllFields(): void | never {

        const send = document.getElementById('form_confirm') as HTMLButtonElement;
        if (!send) throw new Error('Something wrong with #form_confirm');

        // const cardBlock = document.querySelector(".creditCardBlock");
        const cardBack = document.querySelector(".cardBack") as HTMLElement;
        const cardFront = document.querySelector(".basket__modal-creditcard") as HTMLElement;

        if (this.isNameValid
            && this.isAddressValid
            && this.isTelValid 
            && this.isEmailValid) {
                cardBack.style.transform = "perspective(600px) rotateY(-180deg)";
                cardFront.style.transform = "perspective(600px) rotateY(0deg)";
            }else{
                cardBack.style.transform = "perspective(600px) rotateY(0deg)";
                cardFront.style.transform = "perspective(600px) rotateY(180deg)";
            }

        if (
            this.isNameValid
            && this.isAddressValid
            && this.isTelValid 
            && this.isEmailValid
            && this.isCard1Valid
            && this.isCard2Valid
            && this.isCard3Valid
            && this.isCard4Valid
            && this.isDayValid
            && this.isMonthValid
            && this.isCvvValid
        ) {
            send.disabled = false;
        } else {
            send.disabled = true;
        }
    }

    public checkCardNum(): void | never {

        const cardNum = document.getElementById('form_card_valid') as HTMLElement;
        if (!cardNum) throw new Error('Something wrong with #form_card_valid');

        if (this.isCard1Valid && this.isCard2Valid && this.isCard3Valid && this.isCard4Valid) {
            cardNum.classList.add('valid');
            cardNum.classList.remove('invalid');
        } else {
            cardNum.classList.add('invalid');
            cardNum.classList.remove('valid');
        }

    }

    public checkDateCvv(): void | never {

        const dateValid = document.getElementById('form_date_valid') as HTMLElement;
        if (!dateValid) throw new Error('Something wrong with #form_date_valid');
        const cvvValid = document.getElementById('form_cvv_valid') as HTMLElement;
        if (!cvvValid) throw new Error('Something wrong with #form_cvv_valid');


        if (this.isMonthValid && this.isDayValid) {
            dateValid.classList.add('valid');
            dateValid.classList.remove('invalid');
        } else {
            dateValid.classList.add('invalid');
            dateValid.classList.remove('valid');
        }

        if (this.isCvvValid) {
            cvvValid.classList.add('valid');
            cvvValid.classList.remove('invalid');
        } else {
            cvvValid.classList.add('invalid');
            cvvValid.classList.remove('valid');
        }

    }
}