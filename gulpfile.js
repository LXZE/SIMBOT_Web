const gulp = require('gulp');
const ts = require('gulp-typescript');
const supervisor = require( "gulp-supervisor" );
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const webpackDevConfig = require("./webpack.dev.config.js");
const stream = require('webpack-stream');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('webpack', function(){
  return gulp.src('src/main.js')
    .pipe(stream(webpackConfig))
    .pipe(gulp.dest('public/app'))
});

gulp.task("supervisor", function() {
    supervisor( "dist/index.js", {
        watch: ["dist","views"],
    } );
} );

gulp.task('watch', ['scripts'], () => {
  gulp.watch('src/*.ts', ['scripts']);
});

gulp.task('default', ['watch']);