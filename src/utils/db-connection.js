const knex = require('knex')({
    client: 'sqlite3',
    connection: {filename: "./db/optimise-db.sqlite"},
    pool: {
        afterCreate: function (conn, cb) {
          conn.run('PRAGMA foreign_keys = ON', cb)      ///set timezone ="UTC" ????
        }
      }, 
    useNullAsDefault: true
});

module.exports = knex;