var Watcher = require('large-watcher');
var _ = require('lodash');

module.exports = function(codebox) {
    codebox.logger.log("Starting the file watcher");

    var watcher = Watcher(codebox.workspace, 2).start();

    var handler = function(type, files) {
        var filesMap = _.groupBy(files, function(f) {
            return _.split(f, '/', 2).join('/');
        });
        _.forEach(filesMap, function(value, key) {
            var workspace = _.chain(key).split('/').last();
            codebox.events.emit(`fs:${type}:${workspace}`, _.map(value, function(str){
                var result = str.substr(key.length);
                return result.startsWith('/') ? result.substr(1) : result;
            }));
        });
    };

    // Handle deleted files
    watcher.on('deleted', _.partial(handler, 'deleted'));

    // Handle modified files
    watcher.on('modified', _.partial(handler, 'modified'));

    // Handle created files
    watcher.on('created', _.partial(handler, 'created'));

    // Handler errors
    watcher.on('error', function(err) {
        codebox.logger.error(err);
    });

    codebox.logger.log("File watcher started");
};
