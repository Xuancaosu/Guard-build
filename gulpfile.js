const gulp = require('gulp');
const autoPrefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const less = require('gulp-less');
const cssnano = require('gulp-cssnano');
const through2 = require('through2');

const paths = {
  dest: {
    lib: 'lib',
    esm: 'esm',
    dist: 'dist',
  },
  styles: 'src/**/*.less',
  scripts: ['src/**/*.{ts,tsx}', '!src/**/demo/*.{ts,tsx}'],
};

function cssInjection(content) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.less/g, '.css');
}

function compileScripts(babelEnv, destDir) {
  const { scripts } = paths;

  process.env.BABEL_ENV = babelEnv;

  return gulp
    .src(scripts)
    .pipe(babel())
    .pipe(
      through2.obj(function z(file, encoding, next) {
        this.push(file.clone());
        // 找到目标
        if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
          const content = file.contents.toString(encoding);
          file.contents = Buffer.from(cssInjection(content)); // 文件内容处理
          file.path = file.path.replace(/index\.js/, 'css.js'); // 文件重命名
          this.push(file); // 新增该文件
          next();
        } else {
          next();
        }
      }),
    )
    .pipe(gulp.dest(destDir));
}

function compileCJS() {
  return compileScripts('cjs', paths.dest.lib);
}

function commonESM() {
  return compileScripts('esm', paths.dest.esm);
}

function copyLess() {
  return gulp.src(paths.styles).pipe(gulp.dest(paths.dest.dist)).pipe(gulp.dest(paths.dest.esm));
}

function lessToCss() {
  return gulp
    .src(paths.styles)
    .pipe(less())
    .pipe(autoPrefixer()) // 自动添加前缀
    .pipe(cssnano({ zindex: false, reduceIdents: false }))
    .pipe(gulp.dest(paths.dest.lib))
    .pipe(gulp.dest(paths.dest.esm));
}

// 串行
const buildScripts = gulp.parallel(compileCJS, commonESM, lessToCss);

// 并行
const build = gulp.series(buildScripts, copyLess);

exports.build = build;

exports.default = build;
