var
    router = require('koa-router');

exports.init = function (app) {
  app.get('elements','/elements/:start/:count', getAllElements);
};

function *getAllElements(next) {
  var result = yield this.mysql.query('SELECT * FROM element WHERE site="ego" AND type=1 ORDER BY id DESC LIMIT ' + this.params.start +', '+this.params.count );
  this.body = JSON.stringify(result[0]);
  this.set('Content-type','application/json');
  yield next;
};