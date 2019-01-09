const getMousePos = (e) => {
  let posx = 0;
  let posy = 0;

  if (!e) e = window.event;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) 	{
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return { x : posx, y : posy }
}

class HoverImg {
  constructor(el) {
    this.DOM = { el: el };
    this.DOM.image = document.createElement(`span`);
    this.DOM.image.className = `image`;
    this.DOM.image.style.backgroundImage = `url(${this.DOM.el.dataset.img})`;
    this.DOM.el.appendChild(this.DOM.image);

    this.attachHandlers();
  }

  positionElement = (ev) => {
    const mousePos = getMousePos(ev);
    const docScrolls = {
        left : document.body.scrollLeft + document.documentElement.scrollLeft, 
        top : document.body.scrollTop + document.documentElement.scrollTop
    };
    this.DOM.image.style.top = `${mousePos.y + 20 - docScrolls.top}px`;
    this.DOM.image.style.left = `${mousePos.x + 20 - docScrolls.left}px`;
  }

  mouseEnter(ev) {
    this.positionElement(ev);
    this.DOM.image.style.opacity = 1;
  }

  mouseMove(ev) {
    return requestAnimationFrame(() => {
      this.positionElement(ev);
    })
  }

  mouseLeave(ev) {
    this.DOM.image.style.opacity = 0;
  }

  attachHandlers() {
    this.DOM.el.addEventListener('mouseenter', this.mouseEnter.bind(this));
    this.DOM.el.addEventListener('mousemove', this.mouseMove.bind(this));
    this.DOM.el.addEventListener('mouseleave', this.mouseLeave.bind(this));
  }
}

const hoverImages = {
  init() {
    Array.from(document.querySelectorAll(`.work`)).forEach(link => new HoverImg(link));
  }
};

export { hoverImages };