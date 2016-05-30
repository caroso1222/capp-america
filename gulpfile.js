var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
 
gulp.task('serve', ['server','watch']);

gulp.task('server',function(){
    nodemon({
        'script': 'server.js',
        'ignore': 'public/js/*.js'
    });
});

gulp.task('styles', function() {
  return sass('public/css/scss/*.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('public/css'))
    //.pipe(rename({suffix: '.min'}))
    //.pipe(cssnano())
    //.pipe(gulp.dest('public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('public/css/**/*.scss', ['styles']);
    gulp.watch('public/js/*.js', ['scripts']);
    gulp.watch('views/**/*.ejs', ['ejs']);
});

gulp.task('ejs',function(){
    return gulp.src('views/**/*.ejs')
    .pipe(livereload());
});

gulp.task('scripts', function() {
  return gulp.src('public/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    //.pipe(gulp.dest('public/js'))
    //.pipe(rename({suffix: '.min'}))
    //.pipe(uglify())
    //.pipe(gulp.dest('public/js'))
    .pipe(livereload());
});