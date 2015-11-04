import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const src = '.';
const dest = 'dist';

gulp.task('sass', () => {
  return gulp.src(src + '/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded' 
    }).on('error', $.sass.logError)) // Using gulp-sass
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./lib'))
    .pipe(reload({stream: true}));
});

gulp.task('html', ['sass'], () => {
  const assets = $.useref.assets();

  return gulp.src(src + '/*.html')
    .pipe(assets)
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest(src));
});

gulp.task('wiredep', () => {
  gulp.src(src + '/scss/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest(src + '/scss'));

  gulp.src(src + '/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest(src));
});

gulp.task('serve', ['sass'], () => {
  browserSync({
    notify: false,
    port: 9001,
    server: {
      baseDir: [src],
      routes: { 
        'lib/': 'lib' 
      }
    }  
  });

  gulp.watch([
    src + '/*.html',
    src + '/css/*.css',
  ]).on('change', reload);

  gulp.watch(src + '/scss/**/**.scss', ['sass']);
  gulp.watch('bower.json', ['wiredep']);
});

// gulp.task('default', ['clean'], () => {
//   gulp.start('build');
// });
