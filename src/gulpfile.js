var gulp        = require('gulp');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var browserSync = require('browser-sync').create();

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("web/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("web/css"))
        .pipe(browserSync.stream());
});

// move animate.css to web/css
gulp.task('animate', function() {
    return gulp.src('node_modules/animate.css/animate.css')
        .pipe(concat('animate.css'))
        .pipe(gulp.dest("web/css"));
});

// move fontawesome CSS file
gulp.task('fo-aw', function() {
    return gulp.src([
            'node_modules/@fortawesome/fontawesome-free/css/all.css'
        ])
        .pipe(concat('fontawesome.css'))
        .pipe(gulp.dest('web/css'))
        .pipe(browserSync.stream());
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
gulp.task('serve', gulp.series('sass','js','animate','fo-aw', function() {
    gulp.watch("web/scss/*.scss", gulp.series('sass'));
}));

gulp.task('default', gulp.series('serve'));