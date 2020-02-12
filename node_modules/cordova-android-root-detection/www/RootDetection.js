var exec = require('cordova/exec');

exports.isRooted = function (arg0, success, error) {
    exec(success, error, 'RootDetection', 'isRooted', [arg0]);
};
