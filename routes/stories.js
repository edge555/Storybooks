const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Story = mongoose.model('stories');
const {ensureAuthenticated,ensureGuest} = require('../helpers/auth')

// Stories index
router.get('/',(req,res)=>{
    res.render('stories/index');
});

// Add story form
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Process add story
router.post('/',(req,res)=>{
    let allowComments = false;
    if(req.body.allowComments){
        allowComments = true
    }
    const newStory = {
        title : req.body.title,
        body : req.body.body,
        status : req.body.status,
        allowComments : allowComments,
        user : req.user.id
    }
    new Story(newStory)
    .save()
    .then(story =>{
        res.redirect(`/stories/show/${story.id}`);
    });
})
module.exports = router;