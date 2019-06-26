var express = require('express');
var topic = require('../lib/topic');
var router = express.Router();

router.get('/create', function(req,rsp){
    topic.create(req,rsp);
});
router.post('/create_process', function(req,rsp){
    topic.createProcess(req,rsp);
});
router.post('/update_process', function(req,rsp){
    topic.updateProcess(req,rsp);
});
router.post('/delete_process/:topicId', function(req,rsp){
    topic.deleteProcess(req,rsp);
});
router.get('/update/:topicId', function(req,rsp){
    topic.update(req,rsp);
});
router.get('/:topicId', function(req,rsp){
    topic.page(req,rsp);
});


module.exports = router;