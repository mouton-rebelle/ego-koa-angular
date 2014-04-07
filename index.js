var koa  = require('koa'),
  router = require('koa-router'),
  mysql  = require('co-mysql'),
  serve  = require('koa-static'),
  app    = koa();


// handle mysql connection
app.use(function *(next){
  this.mysql = mysql.createConnection({
    host     : 'localhost',
    password : null,
    database : 'ego',
    user     : 'root'}
  );
  this.mysql.connect();
  yield next;
  this.mysql.end();
});

// initialize router
app.use(router(app));
require('./server/controllers/elements').init(app);

// serve static files
app.use(serve('client/',{defer:true,maxage:100*3600*60*24}));

// logger
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.listen(3000);