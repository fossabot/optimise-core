const {isEmptyObject} = require('../utils/basic-utils');

const knex = require('../utils/db-connection');

class RequestMiddleware {
    static verifySessionAndPrivilege(req, res, next) {
        if (req.headers.token) {
            console.log(req.headers.token);
            knex('user_sessions')
                .select({token: 'user_sessions.session_token', username: 'users.username', priv: 'users.admin_priv', userid: 'user_sessions.user'})
                .innerJoin('users', 'users.id', 'user_sessions.user')
                .where({'user_sessions.session_token': req.headers.token, 'user_sessions.expired': 0})
                .then(result => {
                    if (result.length !== 0){
                        req.priv = result[0];
                        next();
                    } else {
                        res.status(400);
                        res.send('You are not logged in. Please provide a valid token.');
                    }})
                .catch(err => {
                    console.log(err);
                    res.status(500);
                    res.send('Database error');
                })
        } else {
            res.status(400);
            res.send('Please provide a token in the header')
        }
    }
}


module.exports = RequestMiddleware;