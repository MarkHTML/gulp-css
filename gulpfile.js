
let company_icon_success = 'images/toast-success.jpg',
    company_icon_warning = 'images/toast-warning.jpg',
    company_icon_error = 'images/toast-error.jpg',
    lint_css_files = [
        'demo/demo.css'
    ],
    /* EXAMPLE
    lint_css_files = [
        '/path/to/css/folder/*.css',
        '!/dont/include/these/css/files/**'
    ],
    * */
    prefix_css_files = lint_css_files;

const gulp              = require("gulp"),
    node_notifier       = require('node-notifier'),
    gulp_Stylelint      = require('gulp-stylelint'),
    gulp_debug          = require('gulp-debug'),
    gulp_autoprefixer   = require('gulp-autoprefixer'); //https://github.com/postcss/autoprefixer#options

//SYSTEM TOAST
let notification = function(options) {
    node_notifier.notify(
        options,
        function (err, response) {
            console.log(response);// Response is response from notification
        }
    );
};

//CSS PROCESS
function css_lint(css_to_parse) {
    var processed_files = [];

    return gulp.src(css_to_parse)
        .pipe(gulp_Stylelint({
            reporters: [
                {formatter: 'string', console: true}
            ]
        })).on('error', function(error) {
            //console.log(error.message);
            notification( {title: 'ERROR in Gulp: Stylelint', message: error.message, icon: company_icon_error, sound: true, wait: true, type: 'error'});
        })
        .pipe(gulp_debug({
                title: '',
                showCount: false,
                logger(message) {
                    console.log(message);
                    var message = ' ' + message.split("\\").pop();
                    message = message.replace("[39m", "");//bug random string added
                    processed_files.unshift(message);
                }
            }
        ))
        .on('end', function() {
            console.log('Processed:' + processed_files.toString());
            //success?
            //notification( {title: 'CSS Processed', message: processed_files.toString(), icon: company_icon_success, sound: true, wait: false, time:1000, type: 'info'});
        });
}

//WATCH ALL FILES BUT PROCESS ONLY CHANGED FILE
const watch = gulp.parallel(watchFiles);
function watchFiles() {
    gulp.watch(lint_css_files, { ignoreInitial: true }).on('change',function(path,stats) {
        return css_lint(path);
    });
}

//AUTOPREFIXER
function auto_prefix() {

    let processed_files = [];

    return gulp.src(prefix_css_files, {base: "./"})
        .pipe(gulp_autoprefixer()
        ).on('error', function(error) {
            console.log(error.message);
            notification( {title: 'ERROR in Gulp: AutoPrefixer', message: error.message, icon: company_icon_error, sound: true, wait: true, type: 'error'});
        })
        .pipe(gulp_debug({
                title: '',
                showCount: false,
                logger(message) {
                    console.log(message);
                    var message = ' ' + message.split("\\").pop();
                    message = message.replace("[39m", "");//bug random string added
                    processed_files.unshift(message);
                }
            }
        ))
        .pipe(gulp.dest("./"))
        .on('end', function() {
            console.log('Processed:' + processed_files.toString());
            notification( {title: 'CSS Processed', message: processed_files.toString(), icon: company_icon_success, sound: true, wait: false, time:1000, type: 'info'});
        });
}


//COMMANDS
exports.default = watch;
exports.autoprefix = auto_prefix;


