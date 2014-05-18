var router      = require('koa-router'),
    im          = require('imagickal'),
    fs          = require('fs');
    thunkify    = require('thunkify');

var readGenerator   = thunkify(fs.readFile);
var existsGenerator = thunkify(fs.exists);

exports.init = function (app) {
  app.get('thumb','/thumb/:width/:file', getThumb);
  app.get('images','/images/:file', getOriginalFile);
};

function *getThumb(next) {
  var path = __dirname + '/../../client/uploads/' + this.config.SITE_ID;
  var dest = path + '/thumbs/'+this.params.width+'__'+this.params.file;

  var found = false;
  try{
    found = yield existsGenerator(dest);
  } catch(e)
  {
    // thunkify gets mixed up there...
    if (e === true)
    {
      found = true;
    }
  }
  if (!found)
  {
    var actions   = {
      resize:   { width: this.params.width },
      strip:    true,
      quality:  90
    };
    yield im.transform( path + '/orig/'+this.params.file, dest, actions);
  }
  this.type = 'image/jpg';
  this.body = yield readGenerator(dest);
  yield next;
}

function *getOriginalFile(next)
{
  var dest = __dirname + '/../../client/uploads/' + this.config.SITE_ID + '/orig/' + this.params.file;
  this.type = 'image/jpg';
  this.body = yield readGenerator(dest);
  yield next;
}