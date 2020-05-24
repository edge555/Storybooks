const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Story = mongoose.model('stories');
const {ensureAuthenticated,ensureGuest} = require('../helpers/auth')

// Stories index
router.get('/',(req,res)=>{
    Story.find({status:'public'})
    .populate('user')
    .then(stories=>{
        res.render('stories/index',{
            stories:stories
        });
    });
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

// Show single story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then(story =>{
        res.render('stories/show',{
            story : story
        });
    });
});

module.exports = router;