var _ = require('lodash');
var path = require('path');

var nameMapping = {
    'create': 'created',
    'update': 'modified',
    'delete': 'deleted'
};

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
                var file = path.relative(codebox.workspace, fullPath),
                    tmp = _.chain(file.split('/')).tail(),
                    workspace = tmp.head().value(),
                    filePath = tmp.tail().join('/').value();
                codebox.events.emit(`fs:${nameMapping[type]}:${workspace}`, filePath);
            }
        }
    });

    codebox.logger.log("File watcher started");
};
