var gulp        = require('gulp');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var nodemon     = require('gulp-nodemon');
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

// Iniciar nodemon
gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'web/server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

// watching scss/html files
gulp.task('serve', gulp.series('sass','js','animate','nodemon', function() {
    browserSync.init(null, {
		proxy: "http://localhost:8080",
        files: ["web/views/**/*.*"],
        browser:"opera",
        port: 80,
	});
    gulp.watch("web/scss/*.scss", gulp.series('sass'));
    gulp.watch("web/views/*.ejs").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));