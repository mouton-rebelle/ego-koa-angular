var router = require('koa-router'),
    im = require('imagickal'),
    fs = require('fs');
    thunkify = require('thunkify');

var read = thunkify(fs.readFile);

exports.init = function (app) {
  app.get('thumb','/thumb/:width/:file', getThumb);
};

function *getThumb(next) {
  var source = __dirname + '/../../client/uploads/eg0/orig/'+this.params.file;
  var dest   = __dirname + '/../../client/uploads/eg0/thumbs/'+this.params.file;
  var redir = '/uploads/eg0/thumbs/'+this.params.file;
  var actions =  {
    resize: { width: this.params.width },
    strip:true,
    quality: 90
  };

  yield im.transform(source, dest, actions);
  this.type = 'image/jpg';
  this.body = yield read(dest);
  yield next;
}