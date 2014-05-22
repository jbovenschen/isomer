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
        return self.parseObj();
      }
    }
  };
  request.send();
};

/*
 * Function for parsing loaded .obj file
 */
Obj.prototype.parseObj = function() {
  var Path = Isomer.Path;
  var Point = Isomer.Point;
  var vertices = [];
  var groups = [];
  var newGroup = [];
  var path = new Path();
  var lines = this.file.split('\n');
  var Point = Isomer.Point;

  for (var i = 0; i < lines.length;i++)
  {
    var line = lines[i].trim().split(/\s+/);

    switch(line[0]) {
      case 'v':
        vertices.push(new Point(parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3])));
        break;

      case 'f':
        var newPathVertices = [];
        line.splice(0, 1);
        for(var x = 0; x < line.length; x++) {
          newPathVertices.push(vertices[line[x]-1]);
        }
        newGroup.push(new Path(newPathVertices));
        break;
      case 'g':
        if (line[1])
        {
            groups.push(newGroup);
        }
        newGroup = new Shape();
        break;
    }
  }

  groups.push(newGroup);
  this.generatedObject = groups;
  this.callBack(this.generatedObject);
};

module.exports = Obj;