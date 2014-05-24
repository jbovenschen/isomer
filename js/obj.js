function Obj(fileUrl, cb) {
  this.fileUrl = fileUrl;
  this.callBack = cb;
  this.importFile();
}

/*
 * Function to import files with obj extension
 */
Obj.prototype.importFile = function () {
  var request = new XMLHttpRequest();
  var self = this;

  request.open('GET', this.fileUrl, true);
  request.responseType = 'text';
  request.onload = function(event) {
    if (request.readyState === 4) { 
      if (request.status === 200) {
        self.file = request.response;
        return self.fromObj();
      }
    }
  };
  request.send();
};

Obj.prototype.fromObj = function() {
  var lines = this.file.split(/[ \t]*\r?\n[ \t]*/);
  var groups = [];
  var shape = [];
  var newPathVertices = [];
  var vertices = [];
  var object = [];

  for(var i = 0; i < lines.length; i++) {
    var lineTokens = lines[i].trim().split(/\s+/);

    switch(lineTokens[0]) {
      case 'v':
        if (lineTokens.length > 3)
          vertices.push(new Point(parseFloat(lineTokens[1]), parseFloat(lineTokens[2]), parseFloat(lineTokens[3])));
        break;
      case 'vt':
        break;
      case 'f':
        if (lineTokens.length > 3) {
          // TODO normal mapping?
          // TODO textures
          newPathVertices = [];

          for (var x = 1; x < lineTokens.length; x++) {
            var faceVertices = lineTokens[x].split('/');
            newPathVertices.push(vertices[faceVertices[0] -1 ]);
          }

          shape.push(new Path(newPathVertices));
        }
        break;
      case 'g':
        var newGroup = [];
        break;
      case 'o':
        break;
      case 'mtllib':
        break;
      case 'usemtl':
        break;
      default:
        break;

    }
  }

  console.log(vertices[12]);
  this.callBack(new Shape(shape));
}

module.exports = Obj;