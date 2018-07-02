var setting  = require('../settings'),
    db = require('mongodb').Db,
    conn = require('mongodb').Connection,
    server = require('mongodb').Server;
    module.exports = new Db(settings.db, new Server(settings.host, settings.port), {
        safe: true
    });

