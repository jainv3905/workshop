const express = require('express');
const router = express();
const authController = require('../conrollers/auth');
const { body } = require('express-validator/check');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

router.post('/signup', [
    body('email').isEmail()
    .withMessage('email not valid')
        .custom((value, { req }) => {
            return User.findAll({ where: { email:value } })
                .then(user => {
                    if (user.length > 0) {
                        console.log(user);
                        return Promise.reject('email exist,please pick another one...');
                    }
                })
        }),
    body('name').isLength({min:3,max:8})
    .withMessage('min 3 and max 8 alphabate required'),
    body('phone').isLength({min:10, max:10}).withMessage('phone must be 10 digit')
    .custom((value, { req }) => {
        return User.findAll({ where: { phone:value } })
            .then(user => {
                if (user.length > 0) {
                    console.log(user);
                    return Promise.reject('phone exist,please pick another one...');
                }
            })
    }),
    body('password').isLength({min:6}).withMessage('minimum 6 digit password')
    ], authController.signup);

router.post('/login',[
    body('email').isEmail().withMessage('email not valid'),
    body('password').isLength({min:6}).withMessage('minimum 6 digit password')
], authController.login);

router.post('/category',[
    body('name').isLength({min:3,max:8})
.withMessage('min 3 and max 8 alphabate required')] ,authController.category);

router.post('/question', isAuth,authController.question);

router.get('/get-category', isAuth, authController.first_page);

router.get('/get-question/:id', isAuth, authController.second_page);

router.post('/answer', isAuth, authController.answer);

router.get('/all-test', isAuth, authController.allTest);

router.get('/user', isAuth,authController.getUser);

router.get('/get-user/:id', isAuth,authController.getSpecificUser);

router.get('/get-test-question/:id', isAuth, authController.gettestQuestion);

router.get('/logout', isAuth, authController.logout);

router.get('/get-category/:id', isAuth,authController.getCategory);

router.post('/post-category', isAuth,authController.postCategory);

router.get('/specific-question/:id', isAuth,authController.getQuestion);

router.post('/post-question', isAuth,authController.postQuestion);

router.get('/dashboard', isAuth,authController.dashboard);

router.get('/get-user-profile', isAuth, authController.getUserProfile);

module.exports = router;