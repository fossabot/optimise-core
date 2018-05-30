const {isEmptyObject} = require('../utils/basic-utils');

const knex = require('../utils/db-connection');

class RequestMiddleware {
    static verifySessionAndPrivilege(req, res, next) {
        if (req.headers.token) {
            knex('user_sessions')
                .select({token: 'user_sessions.session_token', username: 'users.username', priv: 'users.admin_priv', userid: 'user_sessions.user'})
                .innerJoin('users', 'users.id', 'user_sessions.user')
                .where({'user_sessions.session_token': req.headers.token, 'user_sessions.deleted': 0, 'users.deleted': 0})
                .then(result => {
                    if (result.length !== 0){
                        req.requester = result[0];
                        next();
                    } else {
                        res.status(400).send('You are not logged in. Please provide a valid token.');
                    }})
                .catch(err => {
                    console.log(err);
                    res.status(500).send('Database error');
                })
        } else {
            res.status(400).send('Please provide a token in the header')
        }
    }

    /*
    ** Method:  addActionToCollection
    ** Purpose: Monitor behavior of the user and save in the database each action taken by the user.
    */
    static addActionToCollection(req, res, next) {
        let user = 'undefined';
        if (req.headers['token'] != undefined) {
            user = req.headers['token'];
        } else if (req.body && req.body.username) {
            user = req.body.username;
        }
        console.log(req.method + ' - ' + req.originalUrl + ' : ' + user);
        next();
    }
}


module.exports = RequestMiddleware;