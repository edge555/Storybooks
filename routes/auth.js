const express = require('express');
const router = express.Router()
const passport = require('passport');

router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}));

module.exports = router;