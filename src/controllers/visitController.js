const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class VisitController {
    static createVisit(req, res){
        if (req.body.patientId && req.body.visitDate && validateAndFormatDate(req.body.visitDate)){
            knex('patients')
                .select('id')
                .where({'alias_id': req.body.patientId, 'deleted': 0})
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send("Can't seem to find your patient!");
                    } else if (result.length === 1) {
                        const entryObj = {'patient': result[0]['id'], 'visit_date': validateAndFormatDate(req.body.visitDate)};
                        createEntry(req, res, 'visits', entryObj, 'Error. Visit might already exists.')
                    } else {
                        res.status(500).send('Database error');
                    }
                })
        } else {
            res.status(400).send('Error. Please provide the suitable parameters.');
        }
    }

    static deleteVisit(req, res){
        if (req.requester.priv === 1 && req.body.patientId && req.body.visitDate && validateAndFormatDate(req.body.visitDate)) {
            knex('patients')
                .select('id')
                .where({'alias_id': req.body.patientId, 'deleted': 0})
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send("Can't seem to find your patient!");
                    } else if (result.length === 1) {
                        const whereObj = {'patient': result[0]['id'], 'visit_date': validateAndFormatDate(req.body.visitDate)};
                        deleteEntry(req, res, 'visits', whereObj, 'Visit on ' + validateAndFormatDate(req.body.visitDate) + ' of patient ' + req.body.patientId, 1);
                    } else {
                        res.status(500).send('Database error');
                    }
                })
        } else {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        }
    }

}

module.exports = VisitController;