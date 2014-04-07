/* global require */
var lr         = require('tiny-lr'),
    gulp       = require('gulp'),
    bust       = require('gulp-buster'),
    watch      = require('gulp-watch'),
    compass    = require('gulp-compass'),
    concat     = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    uglify     = require('gulp-uglify'),
    jshint     = require('gulp-jshint'),
    server     = lr();

gulp.task('compass', function() {
  gulp.src('./sass/*.scss')
  .pipe(compass({
    bundleExec: true,
    style: 'compressed',
    sourcemap: false,
    css: 'web/medias/css',
    sassDir: 'sass',
    images: 'web/medias/img',
    require:['sass-css-importer']
  }));
});

gulp.task('lint', function() {
  gulp.src('./web/medias/js/sources/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('js-vendors-uglify',function() {
  gulp.src([
    './web/plugins/jquery/jquery.js',
    './web/plugins/jquery-file-upload/js/vendor/jquery.ui.widget.js',
    './web/plugins/jquery-file-upload/js/jquery.iframe-transport.js',
    './web/plugins/jquery.scrollTo/jquery.scrollTo.js',
    './web/plugins/jquery-file-upload/js/jquery.fileupload.js',
    './web/plugins/moment/moment.js',
    './web/plugins/datetimepicker/jquery.datetimepicker.js',
    './web/plugins/ace-builds/src-min-noconflict/ace.js',
    './web/plugins/marked/lib/marked.js',
    './web/plugins/reMarked.js',
    './web/plugins/chosen-build/chosen.jquery.js',
    './web/plugins/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js',
    './web/plugins/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/transition.js',
    './web/plugins/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/button.js',
    './web/plugins/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/dropdown.js',
    './web/plugins/handlebars/handlebars.js'
  ])
  .pipe(concat('vendors.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./web/medias/js'));
});

gulp.task('js-users-uglify',function() {
  gulp.src([
      './web/medias/js/sources/*.js',
    ])
    .pipe(concat('telescope.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./web/medias/js'));
});

gulp.task('js', function() {
  gulp.run('js-vendors-uglify','js-users-uglify');
});

gulp.task('watch', function() {

  gulp.run('js');

  server.listen(35729, function(err) {
    if (err) {
      return console.log(err);
    }
  });

  gulp.watch('./sass/*.scss', function() {
    gulp.run('compass');
  });

  gulp.watch('./web/medias/css/*.css', function(e) {
    server.changed({
      body: {
        files: [e.path]
      }
    });
  });

  gulp.watch('./web/medias/js/**/*.js',function(e){
    gulp.run('js-users-uglify');
  });

  gulp.watch('./web/medias/js/*.js',function(e){
    server.changed({
      body: {
        files: [e.path]
      }
    });
  });

  gulp.watch('**/*.twig', function(e) {
    server.changed({
      body: {
        files: ['$?']
      }
    });
  });

});

gulp.task('cache-buster', function() {
  return gulp.src(
    [
      './web/medias/js/*.js',
      './web/medias/css/*.css'
    ]
  )
  .pipe(watch(
    function(files)
    {
      return files
      .pipe(bust('busters.json')) // the output filename
      .pipe(gulp.dest('.')); // output file to project root
    }
  ));
});


gulp.task('default', function() {
  gulp.run('lint');
  gulp.run('js');
  gulp.run('compass');
  gulp.run('cache-buster');
  gulp.run('watch');
});
