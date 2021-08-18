var gulp        = require('gulp');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var browserSync = require('browser-sync').create();

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

// watching scss/html files
gulp.task('serve', gulp.series('sass', function() {
    gulp.watch("scss/*.scss", gulp.series('sass'));
}));


gulp.task('default', gulp.series('serve'));