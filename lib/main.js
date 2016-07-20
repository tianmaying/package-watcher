var _ = require('lodash');
var path = require('path');

module.exports = function(codebox) {
    codebox.logger.log("Starting the file watcher");

    require('watchr').watch({
        path: codebox.workspace,
        interval: 500,
        listeners: {
            error: function (err) {
                codebox.logger.error(err);
            },
            change: function(type, fullPath, currentStat, previousStat){
                var file = path.relative(codebox.workspace, fullPath);
                var workspace = _.chain(file).split('/', 2).head(),
                    filePath = _.chain(file).split('/', 2).last();
                codebox.events.emit(`fs:${type}:${workspace}`, filePath);
            }
        }
    });

    codebox.logger.log("File watcher started");
};
