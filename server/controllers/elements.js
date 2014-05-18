var router = require('koa-router');

exports.init = function (app) {
  app.get('elements','/elements/:page', getAllElements)
     .get('elements','/elements', getAllElements);
};

function *getAllElements(next) {
  // gather root element paginated
  var page        = parseInt(this.params.page) || 0;
  var count       = this.config.NB_PER_PAGE;
  var result      = yield this.mysql.query('SELECT * FROM element WHERE site="ego" AND active=1 AND parent_id IS NULL ORDER BY id DESC LIMIT ' + (page * count) +', ' + count );

  // gather child elements when needed
  var parentIds   = result[0]
    .filter( function(x) {
      return x.type === '2';
    }).map(
      function(x) { return x.id;
    });

  var children = yield this.mysql.query('SELECT * FROM element WHERE parent_id IN (' + parentIds.join(',') + ')' );

  var clean = result[0].map( function( root ){
    var pictures = children[0].filter(function(child){
      return this.id === child.parent_id;
    },root);
    if (pictures.length)
    {
      getMesh(root,pictures);
    }
    return root;
  });

  this.body = JSON.stringify(clean);
  this.set('Content-type','application/json');
  yield next;
}


function getMesh(rootElement,pictures)
{
  // indexes in db start at one...
  var meshes    = [null];
  pictures.unshift(null);

  var config = rootElement.style.split("\r\n");
  config.forEach(function(conf)
  {
    var mesh = {type:'2', elements:[]};
    var tmp             = conf.split('.');
    var firstElement    = {id: tmp[0]};
    var secondElement   = {id: tmp[2]};
    mesh.horizontal      = tmp[1] === 'h';

    if (firstElement.id.substr(0,1) === 'm')
    {
      mesh.elements.push(meshes[firstElement.id.substr(1)*1]);
    } else {
      mesh.elements.push(pictures[firstElement.id*1]);
    }

    if (secondElement.id.substr(0,1) === 'm')
    {
      mesh.elements.push(meshes[secondElement.id.substr(1)*1]);
    } else {
      mesh.elements.push(pictures[secondElement.id*1]);
    }

    if (mesh.horizontal)
    {
      var
        w1 = mesh.elements[0].width,
        h1 = mesh.elements[0].height,
        w2 = mesh.elements[1].width,
        h2 = mesh.elements[1].height,
        r1 = w1/h1,
        r2 = w2/h2,
        mr = mesh.ratio ? mesh.ratio : r1+r2, // ratio du mesh final
        t1 = r1/mr * 100,
        t2 = r2/mr * 100;

      mesh.ratio = mr;
      mesh.width = 1000;
      mesh.height = mr*1000;
      mesh.elements[0].ratio = t1;
      mesh.elements[1].ratio = t2;
      // mesh.width  = mesh.elements[0].width + mesh.elements[1].width;
    } else {
      mesh.width  = mesh.elements[0].width;
      mesh.height = mesh.elements[1].height + mesh.elements[1].height;
      mesh.ratio = mesh.width/mesh.height;
      mesh.elements[0].ratio = 100;
      mesh.elements[1].ratio = 100;
    }

    meshes.push(mesh);
  });
  var m = meshes.pop();
  rootElement.elements = m.elements;
  rootElement.horizontal = m.horizontal;
}