export default class SliderRender {
  private section = document.querySelector(
    ".main__filter-slider"
  ) as HTMLElement;

  // public showSlider(): void {
  //   this.render();
  //   setInterval(this.render, 10000);
  // }

  public render() {
    setInterval(() => {
      const container = document.createElement("div");
      container.className = "container";
      this.section.append(container);
      const ran = Math.floor(Math.random() * 11);
      const img = new Image();
      img.src = `https://raw.githubusercontent.com/Sedric14/assets/main/online-shop/ban${ran}.jpg`;
      img.onload = () => {
        for (let i = 0; i < 20; i++) {
          const part = document.createElement("div");
          part.className = "part";
          part.style.background = `url(${img.src}) no-repeat`;
          part.style.backgroundPositionX = `${-5 * i}vw`;
          part.style.backgroundSize = "cover";
          part.style.transform = `translateX(${5 * i}vw) scaleX(0)`;
          part.style.zIndex = "2";
          container.append(part);
          setTimeout(() => {
            part.style.transform = `translateX(${5 * i}vw) scaleX(1)`;
            part.style.transition = "300ms";
          }, 70 * i);
        }
      };
      setTimeout(() => {
        this.section.removeChild(this.section.firstChild as HTMLElement);
      }, 15000);
    }, 10000);
  }
}
