export default class SliderService {

    private lowerSlider: HTMLInputElement | null;
    private upperSlider: HTMLInputElement | null

    constructor (idLower: string, idUpper: string) {
        this.lowerSlider = document.querySelector(idLower);
        this.upperSlider = document.querySelector(idUpper);
    }

    public init(): void {

        if (this.lowerSlider === null || this.upperSlider === null) return;
        this.upperSlider.oninput = (): void => {
          if (this.lowerSlider === null || this.upperSlider === null) return;
          const lowerVal: number = parseInt(this.lowerSlider.value);
          const upperVal: number = parseInt(this.upperSlider.value);
        
          if (upperVal < lowerVal + 5) {
            this.lowerSlider.value = String(upperVal - 5);
            
            if (lowerVal == +this.lowerSlider.min) {
                this.upperSlider.value = String(5);
            }
          }
        };
     
     
     this.lowerSlider.oninput = (): void => {
        if (this.lowerSlider === null || this.upperSlider === null) return;
        const lowerVal: number = parseInt(this.lowerSlider.value);
        const upperVal: number = parseInt(this.upperSlider.value);
        
        if (lowerVal > upperVal - 5) {
           this.upperSlider.value = String(lowerVal + 5);
           
           if (upperVal == +this.upperSlider.max) {
              this.lowerSlider.value = String(parseInt(this.upperSlider.max) - 5);
           }
        }
     };
    }

    public getVals(): number[] | undefined {
        if (this.lowerSlider === null || this.upperSlider === null) return undefined;
        const lowerVal: number = parseInt(this.lowerSlider.value);
        const upperVal: number = parseInt(this.upperSlider.value);
        return [lowerVal, upperVal];
    }

    public setVals(lowVal = -1, upVal = -1): void {
        if (this.lowerSlider === null || this.upperSlider === null) return;
        if (lowVal > 0) {
            this.lowerSlider.value = String(lowVal);
        }
        if (upVal > 0) {
            this.upperSlider.value = String(upVal);
        }    
    }

    public setEdges(lowVal = -1, upVal = -1): void {
        if (this.lowerSlider === null || this.upperSlider === null) return;
        if (lowVal > 0) {
            this.lowerSlider.setAttribute('min', String(lowVal))
            this.upperSlider.setAttribute('min', String(lowVal))
        }
        if (upVal > 0) {
            this.upperSlider.setAttribute('max', String(upVal))
            this.lowerSlider.setAttribute('max', String(upVal))
        }

    }

    public fillCounts(index: "price" | "stock", lowVal = -1, upVal = -1): void | never {

        const priceFrom: HTMLElement | null = document.getElementById('price-from');
        const priceTo: HTMLElement | null = document.getElementById('price-to');
        const stockFrom: HTMLElement | null = document.getElementById('stock-from');
        const stockTo: HTMLElement | null = document.getElementById('stock-to');
    
        if (priceFrom === null || priceTo === null) throw new Error('Something wrong with #price-from or #price-to');
        if (stockFrom === null || stockTo === null) throw new Error('Something wrong with #stock-from or #stock-to');
    
        if (index === 'price') {
            if (lowVal > 0) priceFrom.innerHTML = String(lowVal);
            if (upVal > 0) priceTo.innerHTML = String(upVal);            
        } else if (index == "stock") {
            if (lowVal > 0) stockFrom.innerHTML = String(lowVal);
            if (upVal > 0) stockTo.innerHTML = String(upVal);
        }
    }
}
