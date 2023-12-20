import express from 'express';

const MessagesController = require('../controllers/MessagesController');

export default (router: express.Router) => {
    router.post('/message', MessagesController.receive);
}
