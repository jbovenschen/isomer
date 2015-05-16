class Point {
  constructor(x=0, y=0, z=0) {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  /**
   * Translate a point from a given dx, dy, and dz
   */
  translate(dx=0, dy=0, dz=0) {
    return new Point(
      this.x + dx,
      this.y + dy,
      this.z + dz
    );
  }

  /**
   * Scale a point about a given origin
   */
  scale(origin, dx, dy, dz) {
    let p = this.translate(-origin.x, -origin.y, -origin.z);

    /*
     * If both dy and dz are left out, scale all coordinates equally
     * If just dz is missing, set it equal to 1
     */
    [dy, dz] = (!dy && !dz ? [dx, dx] : [dy, (!dz ? 1 : dz)]);

    p.x *= dx;
    p.y *= dy;
    p.z *= dz;

    return p.translate(origin.x, origin.y, origin.z);
  }

  /**
   * Rotate about origin on the X axis
   */
  rotateX (origin, angle) {
    let p = this.translate(-origin.x, -origin.y, -origin.z);

    let z = p.z * Math.cos(angle) - p.y * Math.sin(angle);
    let y = p.z * Math.sin(angle) + p.y * Math.cos(angle);
    p.z = z;
    p.y = y;

    return p.translate(origin.x, origin.y, origin.z);
  }

  /**
   * Rotate about origin on the Y axis
   */
  rotateY (origin, angle) {
    let p = this.translate(-origin.x, -origin.y, -origin.z);

    let x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
    let z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
    p.x = x;
    p.z = z;

    return p.translate(origin.x, origin.y, origin.z);
  }

  /**
   * Rotate about origin on the Z axis
   */
  rotateZ (origin, angle) {
    let p = this.translate(-origin.x, -origin.y, -origin.z);

    let x = p.x * Math.cos(angle) - p.y * Math.sin(angle);
    let y = p.x * Math.sin(angle) + p.y * Math.cos(angle);
    p.x = x;
    p.y = y;

    return p.translate(origin.x, origin.y, origin.z);
  };

  /**
   * The depth of a point in the isometric plane
   */
  depth () {
    /* z is weighted slightly to accomodate |_ arrangements */
    return this.x + this.y - 2 * this.z;
  }

  /**
   * Distance between two points
   */
  distance (p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var dz = p2.z - p1.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

Point.ORIGIN = new Point(0, 0, 0);

export default Point;
