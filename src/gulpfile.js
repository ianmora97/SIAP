var gulp        = require('gulp');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("web/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("web/css"));
});

// move bootstrap JS and Jquery
gulp.task('js', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/popper.js/dist/umd/popper.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.js'
        ])
        .pipe(concat('jq-bs-bundle.js'))
        .pipe(gulp.dest('web/js'));
});

// watching scss/html files
gulp.task('serve', gulp.series('sass','js', function() {
    gulp.watch("web/scss/*.scss", gulp.series('sass'));
    gulp.watch("web/js/*.js", gulp.series('js'));
}));

gulp.task('default', gulp.series('serve'));