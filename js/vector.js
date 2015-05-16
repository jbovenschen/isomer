class Vector {
  constructor(i=0, j=0, k=0) {
    this.i = i;
    this.j = j;
    this.k = k;
  }

  magnitude () {
    return Math.sqrt(this.i * this.i + this.j * this.j + this.k * this.k);
  }

  normalize () {
    let magnitude = this.magnitude();
    /**
     * If the magnitude is 0 then return the zero vector instead of dividing by 0
     */
    if (magnitude === 0) {
      return new Vector(0, 0, 0);
    }
    return new Vector(this.i / magnitude, this.j / magnitude, this.k / magnitude);
  }
}

/**
 * Alternate constructors
 */
Vector.fromTwoPoints = (p1, p2) => {
  return new Vector(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
};

Vector.crossProduct = (v1, v2) => {
  return new Vector((v1.j * v2.k - v2.j * v1.k), (-1 * (v1.i * v2.k - v2.i * v1.k)), (v1.i * v2.j - v2.i * v1.j));
};

Vector.dotProduct = (v1, v2) => {
  return v1.i * v2.i + v1.j * v2.j + v1.k * v2.k;
};

/* Expose the Vector constructor */
export default Vector;
