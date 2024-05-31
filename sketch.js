class MondrianArt {
  constructor(mondrian, rectSize) {
    this.mondrian = mondrian;
    this.rectSize = rectSize;
    this.rectangles = [];
    this.minRectangles = 10;
    this.maxRectangles = 15;
    this.horizontalLines = [];
    this.verticalLines = [];
  }

  calculateMondrian(canvasAspectRatio) {
    this.mondrian.aspect = 1; // Square aspect ratio
    if (1 > canvasAspectRatio) {
      this.mondrian.width = width;
      this.mondrian.height = width / this.mondrian.aspect;
      this.mondrian.yOffset = (height - this.mondrian.height) / 2;
      this.mondrian.xOffset = 0;
    } else if (1 < canvasAspectRatio) {
      this.mondrian.width = height * this.mondrian.aspect;
      this.mondrian.height = height;
      this.mondrian.xOffset = (width - this.mondrian.width) / 2;
      this.mondrian.yOffset = 0;
    } else {
      this.mondrian.width = width;
      this.mondrian.height = height;
      this.mondrian.xOffset = 0;
      this.mondrian.yOffset = 0;
    }
  }

  calculateLines() {
    this.horizontalLines = [];
    this.verticalLines = [];

    let firstY = floor(random(0, 2)) * this.rectSize;
    let firstX = floor(random(0, 2)) * this.rectSize;

    for (let i = 0; i < random(10, 12); i++) {
      let y = firstY + floor(random(i, i * 2)) * this.rectSize + this.rectSize;
      if (y > this.mondrian.height) y = this.mondrian.height;
      let h = this.rectSize / 2;
      this.horizontalLines.push({ y, h, x: 0, w: this.mondrian.width });
      for (let j = this.rectSize; j < this.mondrian.width; j += this.rectSize) {
        if (random() > 0.5) {
          let randomColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200, 200, 200)]);
          this.horizontalLines.push({ x: j, y, size: this.rectSize / 2, color: randomColor });
        }
      }
    }

    for (let i = 0; i < random(10, 12); i++) {
      let x = firstX + floor(random(i, i * 2)) * this.rectSize + this.rectSize;
      if (x > this.mondrian.width) x = this.mondrian.width;
      let w = this.rectSize / 2;
      this.verticalLines.push({ x, w, y: 0, h: this.mondrian.height });
      for (let j = this.rectSize; j < this.mondrian.height; j += this.rectSize) {
        if (random() > 0.5) {
          let randomColor = random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200, 200, 200)]);
          this.verticalLines.push({ x, y: j, size: this.rectSize / 2, color: randomColor });
        }
      }
    }
  }

  drawLines() {
    for (let line of this.horizontalLines) {
      if (line.size) {
        fill(line.color);
        noStroke();
        square(line.x + this.mondrian.xOffset, line.y + this.mondrian.yOffset, line.size);
      } else {
        fill(238, 216, 34);
        noStroke();
        rect(line.x + this.mondrian.xOffset, line.y + this.mondrian.yOffset, line.w, line.h);
      }
    }

    for (let line of this.verticalLines) {
      if (line.size) {
        fill(line.color);
        noStroke();
        square(line.x + this.mondrian.xOffset, line.y + this.mondrian.yOffset, line.size);
      } else {
        fill(238, 216, 34);
        noStroke();
        rect(line.x + this.mondrian.xOffset, line.y + this.mondrian.yOffset, line.w, line.h);
      }
    }
  }

  calculateRectangles() {
    this.rectangles = [];

    for (let i = 0; i < this.horizontalLines.length - 1 && this.rectangles.length < this.maxRectangles; i++) {
      this.generateRectangleBetweenLines(this.horizontalLines[i], this.horizontalLines[i + 1], 'horizontal');
    }

    for (let i = 0; i < this.verticalLines.length - 1 && this.rectangles.length < this.maxRectangles; i++) {
      this.generateRectangleBetweenLines(this.verticalLines[i], this.verticalLines[i + 1], 'vertical');
    }

    while (this.rectangles.length < this.minRectangles) {
      let yMin = floor(random(this.mondrian.height / this.rectSize)) * this.rectSize;
      let xMin = floor(random(this.mondrian.width / this.rectSize)) * this.rectSize;
      let w = this.rectSize;
      let h = this.rectSize * 2;
      let validPosition = true;

      for (let r of this.rectangles) {
        if (!(xMin + w < r.x || xMin > r.x + r.w || yMin + h < r.y || yMin > r.y + r.h)) {
          validPosition = false;
          break;
        }
      }

      if (validPosition) {
        this.rectangles.push({
          x: xMin, y: yMin, w, h,
          color: random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]),
          smallRects: this.generateSmallRects(xMin, yMin, w, h)
        });
      }
    }
  }

  generateRectangleBetweenLines(line1, line2, orientation) {
    let min, max, length;
    if (orientation === 'horizontal') {
      min = line1.y + line1.h;
      max = line2.y;
      length = max - min;
    } else {
      min = line1.x + line1.w;
      max = line2.x;
      length = max - min;
    }

    let attempts = 0;
    let validPosition = false;
    let x, y, w, h;

    while (!validPosition && attempts < 1000) {
      if (orientation === 'horizontal') {
        x = floor(random(this.mondrian.width / this.rectSize)) * this.rectSize;
        y = min;
        w = this.rectSize;
        h = length;
        if (y + h > max) y -= (y + h - max);
      } else {
        x = min;
        y = floor(random(this.mondrian.height / this.rectSize)) * this.rectSize;
        w = length;
        h = this.rectSize;
        if (x + w > max) x -= (x + w - max);
      }

      validPosition = true;

      for (let r of this.rectangles) {
        if (!(x + w < r.x || x > r.x + r.w || y + h < r.y || y > r.y + r.h)) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }

    if (validPosition && length > 0) {
      this.rectangles.push({
        x, y, w, h,
        color: random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]),
        smallRects: this.generateSmallRects(x, y, w, h)
      });
    }
  }

  generateSmallRects(x, y, w, h) {
    let smallRects = [];

    if ((w > this.rectSize || h > this.rectSize) && h > w) {
      let smallRectW = w;
      let smallRectH = floor(random(h / 4, h / 2));
      let smallX = x;
      let smallY = y + floor(random(0, h - smallRectH));
      smallRects.push({ x: smallX, y: smallY, w: smallRectW, h: smallRectH, color: random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]) });

      if (smallRectH > this.rectSize && smallRectW > this.rectSize) {
        let centerRectW = smallRectW / 2;
        let centerRectH = smallRectH / 2;
        let centerX = smallX + (smallRectW - centerRectW) / 2;
        let centerY = smallY + (smallRectH - centerRectH) / 2;
        smallRects.push({ x: centerX, y: centerY, w: centerRectW, h: centerRectH, color: random([color(238, 216, 34), color(200)]) });
      }
    }

    if ((w > this.rectSize || h > this.rectSize) && h < w) {
      let smallRectW = floor(random(w / 4, w / 2));
      let smallRectH = h;
      let smallX = x + floor(random(0, w - smallRectW));
      let smallY = y;
      smallRects.push({ x: smallX, y: smallY, w: smallRectW, h: smallRectH, color: random([color(238, 216, 34), color(173, 57, 42), color(67, 103, 187), color(200)]) });

      if (smallRectH > this.rectSize && smallRectW > this.rectSize) {
        let centerRectW = smallRectW / 2;
        let centerRectH = smallRectH / 2;
        let centerX = smallX + (smallRectW - centerRectW) / 2;
        let centerY = smallY + (smallRectH - centerRectH) / 2;
        smallRects.push({ x: centerX, y: centerY, w: centerRectW, h: centerRectH, color: random([color(238, 216, 34), color(200)]) });
      }
    }

    return smallRects;
  }

  drawRectangles() {
    for (let r of this.rectangles) {
      fill(r.color);
      noStroke();
      rect(r.x + this.mondrian.xOffset, r.y + this.mondrian.yOffset, r.w, r.h);

      for (let sr of r.smallRects) {
        fill(sr.color);
        noStroke();
        rect(sr.x + this.mondrian.xOffset, sr.y + this.mondrian.yOffset, sr.w, sr.h);
      }
    }
  }

  drawIntersectionSquares(analyzer, rectSize) {
    for (let horizontal of this.horizontalLines) {
      for (let vertical of this.verticalLines) {
        if (vertical.x < this.mondrian.width && horizontal.y < this.mondrian.height) {
          let rms = analyzer.getLevel();
          let randomColor = random([color(173, 57, 42), color(67, 103, 187), color(200, 200, 200)]);
          fill(randomColor);
          square(vertical.x + this.mondrian.xOffset, horizontal.y + this.mondrian.yOffset, rectSize / 2 + rms * 200);
          text('Volume: ' + volume.toFixed(2), 10, 20);
          text('Pan: ' + pan.toFixed(2), 10, 40);
        }
      }
    }
  }
}

let rectSize = 40;
let mondrian = { aspect: 0, width: 600, height: 600, xOffset: 0, yOffset: 0 };
let canvasAspectRatio = 0;
let song, analyzer;
let volume = 0.0;
let pan = 0.0;
let mondrianArt = new MondrianArt(mondrian, rectSize);

function preload() {
  song = loadSound('assets/BOOGIE-WOOGIE-PIANO.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateMondrian();
  analyzer = new p5.Amplitude();
  analyzer.setInput(song);

  let button = createButton('Play/Pause');
  button.position((width - button.width) / 2, height - button.height - 2);
  button.mousePressed(play_pause);

  mondrianArt.calculateRectangles();
  mondrianArt.calculateLines();
}

function draw() {
  background(255, 250, 240);
  mondrianArt.drawLines();
  mondrianArt.drawRectangles();
  mondrianArt.drawIntersectionSquares(analyzer, rectSize);
}

function calculateMondrian() {
  canvasAspectRatio = width / height;
  mondrianArt.calculateMondrian(canvasAspectRatio);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(255, 250, 240);
  calculateMondrian();
  draw();
}

function play_pause() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    song.loop();
  }
}

function mouseMoved() {
  volume = map(mouseY, 0, height, 1, 0);
  song.setVolume(volume);

  pan = map(mouseX, 0, width, -1, 1);
  song.pan(pan);
}
