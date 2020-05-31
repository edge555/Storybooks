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
    .sort({date :'desc'})
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

// Edit story form
router.get('/edit/:id',ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story =>{
        if(story.user!=req.user.id){
            res.redirect('/stories');
        }else{
            res.render('stories/edit',{
                story : story
            });
        }
    });
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
    .populate('comments.commentUser')
    .then(story =>{
        res.render('stories/show',{
            story : story
        });
    });
});

// Edit Form Process
router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .then(story => {
    let allowComments = false;
    if(req.body.allowComments){
        allowComments = true
    }
    // New story
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;
    story.save()
        .then(story => {
            res.redirect('/dashboard');
        });
    });
});

// Delete story
router.delete('/:id',(req,res)=>{
    Story.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/dashboard');
    });
});

// Add Comment
router.post('/comment/:id', (req, res) => {
    Story.findOne({
      _id: req.params.id
    })
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }

      // Add to comments array
      story.comments.unshift(newComment); // Unshift adds to the beginning
      story.save()
        .then(story => {
          res.redirect(`/stories/show/${story.id}`);
        });
    });
});

module.exports = router;