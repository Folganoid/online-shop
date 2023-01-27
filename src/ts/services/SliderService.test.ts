import { JSDOM } from "jsdom"
import SliderService from '../services/SliderService';

//mock document
const dom = new JSDOM('<!DOCTYPE html>');
global.document = dom.window.document;

//mock window
Object.defineProperty(global, 'window', {
    value: dom.window,
});

describe ('SliderService tests', () => {


    test('test getVals()', () => {

      //fake dom elements
      const div = document.createElement('div');
              const input = document.createElement('input');
                input.setAttribute("id", "a");
                input.setAttribute("value", '10');
              div.append(input);
              const input2 = document.createElement('input');
                input2.setAttribute("id", "b");
                input2.setAttribute("value", '100');
              div.append(input2);

      document.body.append(div);

      const sliderService = new SliderService('#a', '#b');
      sliderService.init();
      const res = sliderService.getVals();
      if (res === undefined) throw new Error('SliderService.getVals() returns bad value');
      expect(res[0]).toEqual(10);          
      expect(res[1]).toEqual(100);
    });

    test('test setVals()', () => {

      //fake dom elements
      const div = document.createElement('div');
              const input = document.createElement('input');
                input.setAttribute("id", "a");
              div.append(input);
              const input2 = document.createElement('input');
                input2.setAttribute("id", "b");
              div.append(input2);

      document.body.append(div);

      const sliderService = new SliderService('#a', '#b');
      sliderService.init();
      sliderService.setVals(10, 100);
      
      const a = document.getElementById('a') as HTMLInputElement;
      const b = document.getElementById('b') as HTMLInputElement;

      expect(a.value).toEqual("10");          
      expect(b.value).toEqual("100");              

    });

    test('test setEdges()', () => {

      //fake dom elements
      const div = document.createElement('div');
              const input = document.createElement('input');
                input.setAttribute("id", "a");
              div.append(input);
              const input2 = document.createElement('input');
                input2.setAttribute("id", "b");
              div.append(input2);
      document.body.append(div);

      const sliderService = new SliderService('#a', '#b');
      sliderService.init();
      sliderService.setEdges(10, 100);
      
      const a = document.getElementById('a') as HTMLInputElement;
      const b = document.getElementById('b') as HTMLInputElement;

      const aMin = a.getAttribute('min');
      const aMax = a.getAttribute('max');
      const bMin = b.getAttribute('min');
      const bMax = b.getAttribute('max');

      expect(aMin).toEqual("10");
      expect(bMin).toEqual("10");
      expect(aMax).toEqual("100");
      expect(bMax).toEqual("100");   

    });

    test('test fillCounts("price")', () => {

      //fake dom elements
      const div = document.createElement('div');
              const input = document.createElement('input');
                input.setAttribute("id", "a");
              div.append(input);
              const input2 = document.createElement('input');
                input2.setAttribute("id", "b");
              div.append(input2);

              const p = document.createElement('p');
                p.setAttribute("id", "price-from");
              div.append(p);
              const p2 = document.createElement('p');
                p2.setAttribute("id", "price-to");
              div.append(p2);

              const s = document.createElement('p');
                s.setAttribute("id", "stock-from");
              div.append(s);
              const s2 = document.createElement('p');
                s2.setAttribute("id", "stock-to");
              div.append(s2);

      document.body.append(div);

      const sliderService = new SliderService('#a', '#b');
      sliderService.init();
      sliderService.fillCounts("price", 10, 100);
      
      const priceFrom = document.getElementById('price-from');
      const priceTo = document.getElementById('price-to');

      expect(priceFrom?.innerHTML).toEqual("10");          
      expect(priceTo?.innerHTML).toEqual("100");              

    });

    test('test fillCounts("stock")', () => {

      //fake dom elements
      const div = document.createElement('div');
              const input = document.createElement('input');
                input.setAttribute("id", "a");
              div.append(input);
              const input2 = document.createElement('input');
                input2.setAttribute("id", "b");
              div.append(input2);

              const p = document.createElement('p');
                p.setAttribute("id", "price-from");
              div.append(p);
              const p2 = document.createElement('p');
                p2.setAttribute("id", "price-to");
              div.append(p2);

              const s = document.createElement('p');
                s.setAttribute("id", "stock-from");
              div.append(s);
              const s2 = document.createElement('p');
                s2.setAttribute("id", "stock-to");
              div.append(s2);

      document.body.append(div);

      const sliderService = new SliderService('#a', '#b');
      sliderService.init();
      sliderService.fillCounts("stock", 10, 100);
      
      const stockFrom = document.getElementById('stock-from');
      const stockTo = document.getElementById('stock-to');

      expect(stockFrom?.innerHTML).toEqual("10");
      expect(stockTo?.innerHTML).toEqual("100");

    });

});