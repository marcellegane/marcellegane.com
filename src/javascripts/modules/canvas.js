/* global view Path Point */
/* eslint-disable no-bitwise */
import paper from 'paper';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function hexToRgbA(hex) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split(``);

    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }

    c = `0x${c.join('')}`;

    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')}, 1)`;
  }
  throw new Error(`Bad Hex`);
}

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const nsStartDate = new Date(2010, 0, 1);
const nsEndDate = new Date();

function getTeamData() {
  const team = [];

  for (let i = 0; i < 20; i += 1) {
    const teamMember = {
      age: getRandomInt(18, 40),
      height: getRandomInt(160, 190),
      eyeColour: getRandomInt(0, 3),
      startDate: getRandomDate(nsStartDate, nsEndDate),
    };

    team.push(teamMember);
  }

  return team;
}

const dateRange = Number(nsEndDate) - Number(nsStartDate);
const teamData = getTeamData();

class Canvas {
  constructor(parentId, canvasId) {
    this.parentId = parentId;
    this.parent = document.getElementById(this.parentId);
    this.canvasId = canvasId;
    this.canvas = document.getElementById(this.canvasId);
    this.colors = [
      hexToRgbA(`#C2BCC1`),
      hexToRgbA(`#00F7C4`),
      hexToRgbA(`#f9eecf`),
      hexToRgbA(`#eccec6`),
    ];
  }

  setDimensions() {
    this.width = this.getWidth();
    this.height = this.getHeight();
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  getWidth() {
    return this.parent.offsetWidth;
  }

  getHeight() {
    return this.parent.offsetHeight;
  }

  renderNice() {
    const color1 = this.colors[1];
    const color2 = this.colors[0];
    const viewWidth = this.width;
    const viewHeight = this.height;
    const viewPad = viewWidth * 0.06;
    const radius = this.getHeight() * 0.19;
    const circle = new paper.Path.Circle(
      new paper.Point(
        viewWidth - radius - viewPad,
        viewHeight - radius - viewPad
      ),
      radius
    );
    circle.fillColor = color1;
    // circle.fullySelected = true;

    const radiusTwo = radius / 2;
    const circleTwo = new paper.Path.Circle(
      new paper.Point(
        viewWidth - radius * 2 - viewPad,
        viewHeight - radiusTwo - viewPad * 2
      ),
      radiusTwo
    );
    circleTwo.fillColor = color2;

    paper.view.onFrame = event => {
      for (let i = 0; i < circle.segments.length; i += 1) {
        const currX = circle.segments[i].point.x;
        const currY = circle.segments[i].point.y;
        const sinValue = -Math.sin(event.time + i) / 6;
        const cosValue = Math.cos(event.time + i) / 6;

        circle.segments[i].point.x = currX + sinValue;
        circle.segments[i].point.y = currY + cosValue;
      }

      for (let i = 0; i < circleTwo.segments.length; i += 1) {
        const currX = circleTwo.segments[i].point.x;
        const currY = circleTwo.segments[i].point.y;
        const sinValue = -Math.sin(event.time + i) / 10;
        const cosValue = Math.cos(event.time + i) / 10;

        circleTwo.segments[i].point.x = currX + cosValue;
        circleTwo.segments[i].point.y = currY + sinValue;
      }

      // for (let i = 0; i < circleTwo.segments.length; i += 1) {
      //   const currX = circleTwo.segments[i].point.x;
      //   const sinValue = Math.cos((event.time - 0.5) * 2 + i) / 4;
      //   circleTwo.segments[i].point.x = currX - sinValue;
      // }
    };
  }

  renderSerious() {
    const boundsWidth = this.getWidth() / 5;
    const boundsHeight = this.getHeight() / 2;

    for (let i = 0; i < teamData.length; i += 1) {
      // Scale bounding box area based on team member start date
      // Newer start dates produce smaller areas
      let dateScale =
        1 - (Number(teamData[i].startDate) - Number(nsStartDate)) / dateRange;
      // Scale up the range to increase the size of smallest items
      dateScale += 0.2;

      const shapeWidth = boundsWidth * dateScale;
      const shapeWidthRadius = shapeWidth / 2;
      const shapeHeight = boundsHeight * dateScale;
      const shapeHeightRadius = shapeHeight / 2;

      const x0 = getRandomInt(0, this.getWidth() - shapeWidth);
      const y0 = getRandomInt(0, this.getHeight() - shapeHeight);
      const cordsX1 = () => x0 + Math.random() * shapeWidthRadius;
      const cordsY1 = () => y0 + Math.random() * shapeHeightRadius;
      const cordsX2 = () =>
        x0 + shapeWidthRadius + Math.random() * shapeWidthRadius;
      const cordsY2 = () =>
        y0 + shapeHeightRadius + Math.random() * shapeHeightRadius;
      const shape = new paper.Path();

      // Set shape fill based on eye colour data
      shape.fillColor = this.colors[teamData[i].eyeColour];

      // Set shape coordinates
      shape.add(new paper.Point(cordsX1(), cordsY1()));
      shape.add(new paper.Point(cordsX2(), cordsY1()));
      shape.add(new paper.Point(cordsX2(), cordsY2()));
      shape.add(new paper.Point(cordsX1(), cordsY2()));
      shape.closed = true;
      shape.smooth();

      // Show shape bounding box
      // const bounds = new paper.Path();
      // bounds.strokeColor = new Color(0,0,0,0.3);
      // bounds.add(new paper.Point(x0, y0));
      // bounds.add(new paper.Point(x0 + shapeWidth, y0));
      // bounds.add(new paper.Point(x0 + shapeWidth, y0 + shapeHeight));
      // bounds.add(new paper.Point(x0, y0 + shapeHeight));
      // bounds.closed = true;
    }
  }

  render() {
    this.setDimensions();
    paper.setup(this.canvasId);

    this.renderNice();
    // this.renderSerious();
  }

  init() {
    this.render();
    document.getElementById(`canvas`).classList.remove(`is-hidden`);

    window.addEventListener(`resize`, () => {
      this.render();
    });
  }
}

const canvas = {
  populate() {
    const iconCanvas = new Canvas(`canvas`, `canvas-main`);
    iconCanvas.init();
  },
};

export { canvas };
