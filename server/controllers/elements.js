var router = require('koa-router');

exports.init = function (app) {
  app.get('elements','/elements/:page', getAllElements)
     .get('elements','/elements', getAllElements);
};

function *getAllElements(next) {
  var page = parseInt(this.params.page) || 0;
  var count = this.config.NB_PER_PAGE;
  var result = yield this.mysql.query('SELECT * FROM element WHERE site="ego" AND type=1 ORDER BY id DESC LIMIT ' + (page * count) +', ' + count );
  this.body = JSON.stringify(result[0]);
  this.set('Content-type','application/json');
  yield next;
}