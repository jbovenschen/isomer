/**
 * A color instantiated with RGB between 0-255
 *
 * Also holds HSL values
 */
class Color {
  constructor (r=0, g=0, b=0, a=100) {
    this.r = parseInt(r);
    this.g = parseInt(g);
    this.b = parseInt(b);
    this.a = parseFloat((Math.round(a * 100) / 100));

    this.loadHSL();
  }

  /*
   * Convert rgb values to a hex value
   */
  toHex() {
    let hex = (this.r * 256 * 256 + this.g * 256 + this.b).toString(16);
    if (hex.length < 6) {
      hex = new Array(6 - hex.length + 1).join('0') + hex;
    }

    return '#' + hex;
  }

  /**
   * Returns a lightened color based on a given percentage and an optional
   * light color
   */
  lighten(percentage, lightColor=new Color(255, 255, 255)) {
    let newColor = new Color(
      (lightColor.r / 255) * this.r,
      (lightColor.g / 255) * this.g,
      (lightColor.b / 255) * this.b,
      this.a
    );

    newColor.l = Math.min(newColor.l + percentage, 1);

    newColor.loadRGB();
    return newColor;
  }

  /**
   * Loads HSL values using the current RGB values
   * Converted from:
   * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
   */
  loadHSL() {
    let r = this.r / 255;
    let g = this.g / 255;
    let b = this.b / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;  // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    this.h = h;
    this.s = s;
    this.l = l;
  }


  /**
   * Reloads RGB using HSL values
   * Converted from:
   * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
   */
  loadRGB () {
    let r, g, b;
    let h = this.h;
    let s = this.s;
    let l = this.l;

    if (s === 0) {
      r = g = b = l;  // achromatic
    } else {
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = this._hue2rgb(p, q, h + 1 / 3);
      g = this._hue2rgb(p, q, h);
      b = this._hue2rgb(p, q, h - 1 / 3);
    }

    this.r = parseInt(r * 255);
    this.g = parseInt(g * 255);
    this.b = parseInt(b * 255);
  }


  /**
   * Helper function to convert hue to rgb
   * Taken from:
   * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
   */
  _hue2rgb (p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
}

/* Expose the Color constructor */
export default Color;
