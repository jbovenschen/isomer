import Point from './point';


/**
 * Path utility class
 *
 * An Isomer.Path consists of a list of Isomer.Point's
 */
class Path {
  constructor(points=[]) {
    this.points = (points instanceof Point ? [points] : points);
  }

  /**
   * Pushes a point onto the end of the path
   */
  push(point) {
    this.points.push(point);
  }

  /**
   * Returns a new path with the points in reverse order
   */
  reverse() {
    let points = Array.prototype.slice.call(this.points);

    return new Path(points.reverse());
  }

  /**
   * Translates a given path
   *
   * Simply a forward to Point#translate
   */
  translate(x, y, z) {
    return new Path(this.points.map((point) => {
      return point.translate(x, y, z);
    }));
  }

  /**
   * Returns a new path rotated along the X axis by a given origin
   *
   * Simply a forward to Point#rotateX
   */
  rotateX (origin, angle) {
    return new Path(this.points.map((point) => {
      return point.rotateX(origin, angle);
    }));
  }

  /**
   * Returns a new path rotated along the Y axis by a given origin
   *
   * Simply a forward to Point#rotateY
   */
  rotateY (origin, angle) {
    return new Path(this.points.map((point) => {
      return point.rotateY(origin, angle);
    }));
  }

  /**
   * Returns a new path rotated along the Z axis by a given origin
   *
   * Simply a forward to Point#rotateZ
   */
  rotateZ (origin, angle) {
    return new Path(this.points.map((point) => {
      return point.rotateZ(origin, angle);
    }));
  }

  /**
   * Scales a path about a given origin
   *
   * Simply a forward to Point#scale
   */
  scale (origin, dx, dy, dz) {
    return new Path(this.points.map(function(point) {
      return point.scale(origin, dx, dy, dz);
    }));
  }

  /**
   * The estimated depth of a path as defined by the average depth
   * of its points
   */
  depth() {
    var i, total = 0;
    for (i = 0; i < this.points.length; i++) {
      total += this.points[i].depth();
    }

    return total / (this.points.length || 1);
  }

  /**
   * If a shape will be set extend current Path class with the given shapes
   */
  set shapes(shapes) {
    let currentPropertyNames = Object.getOwnPropertyNames(this);

    shapes.forEach((shape) => {
      Path[shape.name] = shape;
    });
  }
}


/**
 * A rectangle with the bottom-left corner in the origin
 */
let Rectangle = (origin, width=1, height=1) => {
  return new Path([
    origin,
    new Point(origin.x + width, origin.y, origin.z),
    new Point(origin.x + width, origin.y + height, origin.z),
    new Point(origin.x, origin.y + height, origin.z)
  ]);
};

/**
 * A circle centered at origin with a given radius and number of vertices
 */
let Circle = (origin, radius, vertices=20) => {
  let i, path = new Path();

  for (i = 0; i < vertices; i++) {
    path.push(new Point(
      radius * Math.cos(i * 2 * Math.PI / vertices),
      radius * Math.sin(i * 2 * Math.PI / vertices),
      0));
  }

  return path.translate(origin.x, origin.y, origin.z);
};


/**
 * A star centered at origin with a given outer radius, inner
 * radius, and number of points
 *
 * Buggy - concave polygons are difficult to draw with our method
 */

let Star = (origin, outerRadius, innerRadius, points) => {
  let i, r, path = new Path();

  for (i = 0; i < points * 2; i++) {
    r = (i % 2 === 0) ? outerRadius : innerRadius;

    path.push(new Point(
      r * Math.cos(i * Math.PI / points),
      r * Math.sin(i * Math.PI / points),
      0));
  }

  return path.translate(origin.x, origin.y, origin.z);
};

/*
  Define some paths to play with
*/
Path.prototype.shapes = [Rectangle, Circle, OldStar, Star];

/* Expose the Path constructor */
export default Path;
