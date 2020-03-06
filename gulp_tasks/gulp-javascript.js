var gulp = require("gulp"),
  concat = require("gulp-concat"),
  gulpif = require("gulp-if"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify");

var srcJs = {
  app: [
    "./src/assets/js/vr/jquery-start.js",
    "./src/assets/js/vr/functions/*.js",
    "./src/assets/js/vr/doc-ready.js",
    "./src/assets/js/vr/jquery-end.js"
  ],
  vendor: [
    "./bower_components/jquery/dist/jquery.min.js",
    "./bower_components/gsap/dist/gsap.min.js",
    "./bower_components/gsap/dist/ScrollToPlugin.min.js",
    "./bower_components/imagesloaded/imagesloaded.pkgd.min.js",
    "./bower_components/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js",
    "./bower_components/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js",
    "./bower_components/handlebars/handlebars.min.js",
    "./bower_components/jquery-mousewheel/jquery.mousewheel.min.js",
    "./bower_components/jquery.browser/dist/jquery.browser.min.js",
    "./bower_components/swiper/package/js/swiper.min.js",
    "!/src/assets/js/vendor/**/*.js"
  ]
};

gulp.task("concatApp", function() {
  return (
    gulp
      .src(srcJs.app)
      .pipe(sourcemaps.init())
      .pipe(concat("app.js"))
      //.pipe(gulpif(global.env === 'prod', uglify( { compress: { drop_console: false } } )))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./dist/assets/js/"))
  );
});

gulp.task("concatVendor", function() {
  return (
    gulp
      .src(srcJs.vendor)
      .pipe(concat("vendor.js"))
      //.pipe(gulpif(global.env === 'prod', uglify( { compress: { drop_console: true } } )))
      .pipe(gulp.dest("./dist/assets/js/"))
  );
});

gulp.task("concat", ["concatApp", "concatVendor"]);

// Linter
var eslint = require("gulp-eslint");

gulp.task("lint", ["concat"], function() {
  return gulp
    .src("./dist/assets/js/app.js")
    .pipe(eslint({ useEslintrc: false }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
