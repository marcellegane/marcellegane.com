import { TimelineMax, TweenMax, Expo } from 'gsap';

const getMousePos = (e = window.event) => {
  let posx = 0;
  let posy = 0;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx =
      e.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    posy =
      e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return { x: posx, y: posy };
};

class HoverImg {
  constructor(el) {
    this.DOM = { el };
    this.DOM.hover = document.createElement(`span`);
    this.DOM.hover.className = `hover`;
    this.DOM.hover.innerHTML = `
      <div class="hover__inner">
        <div 
          class="hover__img"
          style="background-image: url(${this.DOM.el.dataset.img})"
        ></div>
      </div>
    `;
    this.DOM.el.appendChild(this.DOM.hover);
    this.DOM.hoverInner = this.DOM.hover.querySelector('.hover__inner');
    this.DOM.hoverImg = this.DOM.hoverInner.querySelector('.hover__img');
    this.attachHandlers();
  }

  positionElement = ev => {
    const mousePos = getMousePos(ev);
    const docScrolls = {
      left: document.body.scrollLeft + document.documentElement.scrollLeft,
      top: document.body.scrollTop + document.documentElement.scrollTop,
    };
    this.DOM.hover.style.top = `${mousePos.y + 20 - docScrolls.top}px`;
    this.DOM.hover.style.left = `${mousePos.x + 20 - docScrolls.left}px`;
  };

  mouseEnter(ev) {
    this.positionElement(ev);
    this.show();
  }

  mouseMove(ev) {
    return requestAnimationFrame(() => {
      this.positionElement(ev);
    });
  }

  mouseLeave() {
    this.hide();
  }

  show() {
    TweenMax.killTweensOf(this.DOM.hoverInner);
    TweenMax.killTweensOf(this.DOM.hoverImg);

    this.tl = new TimelineMax({
      onStart: () => {
        this.DOM.hover.style.opacity = 1;
        TweenMax.set(this.DOM.el, { zIndex: 1000 });
      },
    })
      .add('begin')
      .set([this.DOM.hoverInner, this.DOM.hoverImg], {
        transformOrigin: '50% 100%',
      })
      .add(
        new TweenMax(this.DOM.hoverInner, 0.3, {
          ease: Expo.easeOut,
          startAt: { y: '140%', rotation: 30 },
          y: '0%',
          rotation: 0,
        }),
        'begin'
      )
      .add(
        new TweenMax(this.DOM.hoverImg, 0.3, {
          ease: Expo.easeOut,
          startAt: { y: '-140%', rotation: -30 },
          y: '0%',
          rotation: 0,
        }),
        'begin'
      )
      .add(
        new TweenMax(this.DOM.hoverImg, 0.3, {
          ease: Expo.easeOut,
          startAt: { scale: 2 },
          scale: 1,
        }),
        'begin'
      );
  }

  hide() {
    TweenMax.killTweensOf(this.DOM.hoverInner);
    TweenMax.killTweensOf(this.DOM.hoverImg);

    this.tl = new TimelineMax({
      onStart: () => {
        TweenMax.set(this.DOM.el, { zIndex: 999 });
      },
      onComplete: () => {
        TweenMax.set(this.DOM.el, { zIndex: '' });
        TweenMax.set(this.DOM.hover, { opacity: 0 });
      },
    })
      .add('begin')
      .add(
        new TweenMax(this.DOM.hoverInner, 0.4, {
          ease: Expo.easeOut,
          y: '140%',
        }),
        'begin'
      )
      .add(
        new TweenMax(this.DOM.hoverImg, 0.4, {
          ease: Expo.easeOut,
          y: '-140%',
          scale: 1.2,
        }),
        'begin'
      );
  }

  attachHandlers() {
    this.DOM.el.addEventListener('mouseenter', this.mouseEnter.bind(this));
    this.DOM.el.addEventListener('mousemove', this.mouseMove.bind(this));
    this.DOM.el.addEventListener('mouseleave', this.mouseLeave.bind(this));
  }
}

const hoverImages = {
  init() {
    Array.from(document.querySelectorAll(`.work`)).forEach(
      link => new HoverImg(link)
    );
  },
};

export { hoverImages };
