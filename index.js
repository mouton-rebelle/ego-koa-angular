var koa     = require('koa'),
  Resource  = require('koa-resource-router'),
  serve     = require('koa-static'),
  logger    = require('koa-logger'),
  monk      = require('monk'),
  parse     = require('co-body'),
  wrap      = require('co-monk'),
  db        = monk('localhost/eg0'),
  app       = koa();


app.use(logger());

// handle configuration (config file later)
// ====================================================
app.use(function *(next){
  this.config = {
    NB_PER_PAGE: 10,
    SITE_ID:'eg0'
  };
  yield next;
});

var elements = wrap(db.get('elements'));

var elementsResource = new Resource('elements', {


  // GET /elements
  index: function *(next) {
    var els = yield {elements:elements.find({})};
    console.log(els);
    this.body = els;
  },
  // POST /elements
  create: function *(next) {
    var data = yield parse.json(this);
    yield elements.insert(data.element);
    this.body = data;
  },
  // GET /elements/:id
  show: function *(next) {
    var el = yield elements.findById(this.params.element);
    this.body = el;
  },
  // // PUT /elements/:id
  update: function *(next) {
    var data = yield parse.json(this);
    var upd = yield elements.updateById(this.params.element, data.element );
    data.element._id = this.params.element;
    this.body = {element:data.element};
  },
  // // DELETE /elements/:id
  destroy: function *(next) {
    yield elements.remove({_id:this.params.element});
    this.body = 1;
  }
});

app.use(elementsResource.middleware());


// handle mysql connection
// ====================================================
// app.use(function *(next){
//   this.mysql = mysql.createConnection({
//     host     : 'localhost',
//     password : null,
//     database : 'ego',
//     user     : 'root'}
//   );
//   this.mysql.connect();
//   yield next;
//   this.mysql.end();
// });

// initialize router
// ====================================================
// app.use(router(app));
// require('./server/controllers/elements').init(app);
// require('./server/controllers/images').init(app);

// serve static files
// ====================================================
app.use(serve('client/',{defer:true}));


app.listen(3000);