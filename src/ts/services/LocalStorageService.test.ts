import LocalStorageService from "./LocalStorageService";
import { basketItem } from "../interfaces/Common";

const lss = new LocalStorageService();

interface A {
  [key: string]: string;
}

const localStorageMock = (function () {
  let store = {} as A;

  return {
    getItem(key: string) {
      return store[key];
    },

    setItem(key: string, value: string) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key: string) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("LocalStorageServise tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Add tests", () => {
    test("test add (add item)", () => {
      const res = [{ id: 1, count: 1 }];
      lss.add(1);
      const s = JSON.parse(localStorage.getItem("basket") as string);
      expect(s).toEqual(res);
    });

    test("test add (add count)", () => {
      const res = [
        { id: 1, count: 2 },
        { id: 2, count: 1 },
      ];
      lss.add(1);
      lss.add(1);
      lss.add(2);
      const s = JSON.parse(localStorage.getItem("basket") as string);
      expect(s).toEqual(res);
    });
  });

  describe("Remove tests", () => {
    test("test remove (count dowm)", () => {
      const res = [
        { id: 1, count: 1 },
        { id: 2, count: 1 },
      ];
      lss.add(1);
      lss.add(1);
      lss.add(2);
      lss.remove(1);
      const s = JSON.parse(localStorage.getItem("basket") as string);
      expect(s).toEqual(res);
    });

    test("test remove (delete)", () => {
      const res = [{ id: 2, count: 1 }];
      lss.add(1);
      lss.add(2);
      lss.remove(1);
      const s = JSON.parse(localStorage.getItem("basket") as string);
      expect(s).toEqual(res);
    });
  });

  test("test getAll", () => {
    const res = [
      { id: 1, count: 1 },
      { id: 2, count: 1 },
    ];
    lss.add(1);
    lss.add(2);
    expect(lss.getAll()).toEqual(res);
  });

  test("test clean", () => {
    const res = [] as basketItem[];
    lss.add(1);
    lss.add(2);
    lss.clean();
    const s = JSON.parse(localStorage.getItem("basket") as string);
    expect(s).toEqual(res);
  });

  test("test getTotalPrice", () => {
    const res = 756;
    lss.add(1);
    lss.add(1);
    lss.add(2);
    expect(lss.getTotalPrice()).toEqual(res);
  });
});
