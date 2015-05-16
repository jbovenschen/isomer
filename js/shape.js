import Path from './path';
import Point from './point';

/**
 * Shape utility class
 *
 * An Isomer.Shape consists of a list of Isomer.Path's
 */
class Shape {
  constructor(paths=[]) {
    this.paths = (paths instanceof Path ? [paths] : paths);
  }

  /**
   * Pushes a path onto the end of the Shape
   */
  push(path) {
    this.paths.push(path);
  }

  /**
   * Translates a given shape
   *
   * Simply a forward to Path#translate
   */
  translate(x, y, z) {
    return new Shape(this.paths.map(function(path) {
      return path.translate(x, y, z);
    }));
  }

  /**
   * Rotates a given shape along the X axis around a given origin
   *
   * Simply a forward to Path#rotateX
   */
  rotateX(origin, angle) {
    return new Shape(this.paths.map(function(path) {
      return path.rotateX(origin, angle);
    }));
  }

  /**
   * Rotates a given shape along the Y axis around a given origin
   *
   * Simply a forward to Path#rotateY
   */
  rotateY(origin, angle) {
    return new Shape(this.paths.map(function(path) {
      return path.rotateY(origin, angle);
    }));
  }

  /**
   * Rotates a given shape along the Z axis around a given origin
   *
   * Simply a forward to Path#rotateZ
   */
  rotateZ(origin, angle) {
    return new Shape(this.paths.map(function(path) {
      return path.rotateZ(origin, angle);
    }));
  }

  /**
   * Scales a path about a given origin
   *
   * Simply a forward to Point#scale
   */
  scale(origin, dx, dy, dz) {
    return new Shape(this.paths.map(function(path) {
      return path.scale(origin, dx, dy, dz);
    }));
  }

  /**
   * Produces a list of the shape's paths ordered by distance to
   * prevent overlaps when drawing
   */
  orderedPaths() {
    /**
     * Sort the list of faces by distance then map the entries, returning
     * only the path and not the added "further point" from earlier.
     */
    return this.paths.sort(function(pathA, pathB) {
      return pathB.depth() - pathA.depth();
    });
  }

  set predefinedShapes(shapes) {
    shapes.forEach((shape) => {
      Shape[shape.name] = shape;
    });
  }
}

/**
 * Utility function to create a 3D object by raising a 2D path
 * along the z-axis
 */
Shape.extrude = (path, height=1) => {
  let i, topPath = path.translate(0, 0, height);
  let shape = new Shape();

  /* Push the top and bottom faces, top face must be oriented correctly */
  shape.push(path.reverse());
  shape.push(topPath);

  /* Push each side face */
  for (i = 0; i < path.points.length; i++) {
    shape.push(new Path([
      topPath.points[i],
      path.points[i],
      path.points[(i + 1) % path.points.length],
      topPath.points[(i + 1) % topPath.points.length]
    ]));
  }

  return shape;
};

/**
 * A prism located at origin with dimensions dx, dy, dz
 */
let Prism = (origin, dx=1, dy=1, dz=1) => {
  /* The shape we will return */
  let prism = new Shape();

  /* Squares parallel to the x-axis */
  var face1 = new Path([
    origin,
    new Point(origin.x + dx, origin.y, origin.z),
    new Point(origin.x + dx, origin.y, origin.z + dz),
    new Point(origin.x, origin.y, origin.z + dz)
  ]);

  /* Push this face and its opposite */
  prism.push(face1);
  prism.push(face1.reverse().translate(0, dy, 0));

  /* Square parallel to the y-axis */
  let face2 = new Path([
    origin,
    new Point(origin.x, origin.y, origin.z + dz),
    new Point(origin.x, origin.y + dy, origin.z + dz),
    new Point(origin.x, origin.y + dy, origin.z)
  ]);
  prism.push(face2);
  prism.push(face2.reverse().translate(dx, 0, 0));

  /* Square parallel to the xy-plane */
  let face3 = new Path([
    origin,
    new Point(origin.x + dx, origin.y, origin.z),
    new Point(origin.x + dx, origin.y + dy, origin.z),
    new Point(origin.x, origin.y + dy, origin.z)
  ]);
  /* This surface is oriented backwards, so we need to reverse the points */
  prism.push(face3.reverse());
  prism.push(face3.translate(0, 0, dz));

  return prism;
};

/**
 * A pyramid located at origin with dimensions dx, dy, dz
 */
let Pyramid = (origin, dx=1, dy=1, dz=1) => {
  let pyramid = new Shape();

  /* Path parallel to the x-axis */
  let face1 = new Path([
    origin,
    new Point(origin.x + dx, origin.y, origin.z),
    new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz)
  ]);
  /* Push the face, and its opposite face, by rotating around the Z-axis */
  pyramid.push(face1);
  pyramid.push(face1.rotateZ(origin.translate(dx / 2, dy / 2), Math.PI));

  /* Path parallel to the y-axis */
  let face2 = new Path([
    origin,
    new Point(origin.x + dx / 2, origin.y + dy / 2, origin.z + dz),
    new Point(origin.x, origin.y + dy, origin.z)
  ]);
  pyramid.push(face2);
  pyramid.push(face2.rotateZ(origin.translate(dx / 2, dy / 2), Math.PI));

  return pyramid;
};

/**
 * A cylinder located at origin with radius, amount of vertices and height
 */
let Cylinder = (origin, radius=1, vertices, height) => {
  let circle = Path.Circle(origin, radius, vertices);
  return Shape.extrude(circle, height);
};

/*
  Define some shapes to play with
*/
Shape.prototype.predefinedShapes = [Prism, Pyramid, Cylinder];

/* Expose the Shape constructor */
export default Shape;
