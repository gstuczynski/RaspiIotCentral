var gulp = require('gulp');
var fs = require('fs');
var GulpSSH = require('gulp-ssh');

var config = {
  host: '192.168.0.100',
  port: 22,
  username: 'pi',
  password: 'raspberry'
}

var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
})

gulp.task('copy-to-raspi', function () {
  return gulp.src('./*')
    .pipe(gulpSSH.dest('/home/pi/projects/central-server/'))
})

gulp.task('watch', function () {
  gulp.watch('app.js', ['copy-to-raspi']);
})