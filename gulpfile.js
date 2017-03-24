var through = require('through2');
var path = require('path');
var gulp = require('gulp');
var cheerio = require('cheerio');
var fs = require('fs');


function html(opt) {
  var map = opt.map;
  var loader = opt.loader;
  return through.obj(function (file, enc, cb) {
    try {
      if (file.isBuffer()) {
        var htmlcode = file.contents.toString();
        var $ = cheerio.load(htmlcode, {
          decodeEntities: false
        });
        $('link[rel="stylesheet"]').each(function () {
          var link = $(this);
          var href = (link.attr('href') + '').replace(/^\//, '');
          if (map[href]) {
            $(this).remove();
          }
        });
        $('script[src]').each(function () {
          var script = $(this);
          var src = (script.attr('src') + '').replace(/^\//, '');
          if (map[src]) {
            $(this).remove();
          }
        });
        $('body').append(loader);

        file.contents = new Buffer($.html());
      }
      cb(null, file);
    } catch (ex) {
      cb(ex, file);
    }
  });
}

gulp.task('html', function(){
  var map = require('./dist/map.json');
  var loader = fs.readFileSync('./dist/' + map['loader.js'], {encoding: 'utf-8'});
  delete map['loader.js'];
  loader = '<script>\n!function(version){\n' + loader + '\n}(\n' + JSON.stringify(map) + '\n)\n</script>';
  return gulp.src('./dist/*.html').pipe(html({map: map, loader: loader})).pipe(gulp.dest('./dist/'));
});

gulp.task('images', function(){
  return gulp.src('./src/images/**/*').pipe(gulp.dest('./dist/images'));
});

gulp.task('default', function () {
  gulp.start('html','images');
});

