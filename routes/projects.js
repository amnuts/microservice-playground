const router = require('express').Router();
const _ = require('lodash');
const uuid = require('uuid');
const helpers = require('../helpers');

let mockData = require(`../mock/${process.env.SERVICE_NAME}-data.js`);

router
    .get('/:accountId', (req, res, next) => {
        return res.json(_.filter(mockData, { account_id: parseInt(req.params.accountId) }));
    })
    .get('/:accountId/:projectId', (req, res, next) => {
        return res.json(_.find(mockData, { id: req.params.projectId, account_id: parseInt(req.params.accountId) }));
    })
    .post('/:accountId', (req, res, next) => {
        if (!helpers.hasAllProps(['userId', 'title'], req.body)) {
            throw new Error('MissingRequiredElements');
        }
        let data = {
            id: uuid.v4(),
            account_id: parseInt(req.params.accountId),
            user_id: parseInt(req.body.userId),
            added: new Date(),
            modified: null,
            title: req.body.title
        };
        mockData.push(data);
        return res.json(data);
    })
    .patch('/:accountId/:projectId', (req, res, next) => {
        if (!helpers.hasAnyProps(['title'], req.body)) {
            throw new Error('MissingRequiredElements');
        }
        let data = _.find(mockData, { id: req.params.projectId, account_id: parseInt(req.params.accountId) });
        if (data) {
            data.title = req.body.title;
            data.modified = new Date();
        }
        return res.json(data);
    });

module.exports = router;
