/* global require */
var lr         = require('tiny-lr'),
    gulp       = require('gulp'),
    watch      = require('gulp-watch'),
    compass    = require('gulp-compass'),
    concat     = require('gulp-concat'),
    nodemon    = require('gulp-nodemon'),
    server     = lr();

var paths = {
  client: ['client/css/*.css','client/js/**/*.js','client/index.html'],
  node: ['server/**/*.js','index.js']
};



gulp.task('compass', function() {
  gulp.src('./sass/*.scss')
  .pipe(compass({
    bundleExec: true,
    style: 'compressed',
    sourcemap: false,
    css: 'client/css',
    sassDir: 'sass',
    images: 'client/img'
  }));
});

gulp.task('watch', function() {

  server.listen(35729, function(err) {
    if (err) {
      return console.log(err);
    }
  });

  nodemon({ script: 'index.js', ext: 'js', ignore: paths.client, nodeArgs: ['--harmony'] })
    .on('restart', function () {
      console.log('restarted!');
  });

  gulp.watch('./sass/*.scss',['compass']);

  gulp.watch(paths.client, function(e) {
    console.log(e.path + ' changed, reloading browser');
    server.changed({
      body: {
        files: [e.path]
      }
    });
  });

});

gulp.task('default', ['watch']);
