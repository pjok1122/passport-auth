var author = require('../lib/author');
var express = require('express');
var router = express.Router();

router.get('', function(req,rsp){
    author.home(req,rsp);
});
router.post('/create_process', function(req,rsp){
    author.createProcess(req,rsp);
});
router.post('/update_process', function(req,rsp){
    author.updateProcess(req,rsp);
});
router.post('/delete_process', function(req,rsp){
    author.deleteProcess(req,rsp);
});
router.get('/update/:authorId', function(req,rsp){
    author.update(req,rsp);
});

module.exports = router;