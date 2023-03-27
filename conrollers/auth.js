const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Category = require('../models/category');
const Question = require('../models/questions');
const Answer = require('../models/answers');
const Student_test = require('../models/student_test');

exports.signup = async (req, res, next) => {
    const password = req.body.password.toString();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
        });
    }
    try {
        const hashedPassword = await bcrypt
            .hash(password, 12);
        if (!hashedPassword) {
            const error = new Error('password not hashed');
            error.statusCode = 401;
            throw error;
        }
        const result = await User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            stream:"",
            type: req.body.type
        });
        if (!result) {
            const error = new Error('user not created');
            error.statusCode = 500;
            throw error;
        }
        res.status(201).json({ message: 'User created!',user:result,status:"true"});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password.toString();
    const type = req.body.type;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
        });
    }
    try {
        const user = await User.findOne({ where: [{ email: email },{ type:type }] });
        if (!user) {
            const error = new Error('user not Exist');
            error.statusCode = 404;
            throw error;
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if (!doMatch) {
            return res.status(500).json({ error: 'invalid password' });
        }
        const token = jwt.sign(
            {
                email:user.email,
                userId: user.id
            },
            'somesupersecretsecret'
        );
        user.token = token;
        const savedUser = await user.save();
        res.status(201).json({user:savedUser,status:true});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.category = async (req, res, next) => {
    const name = req.body.name;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
        });
    }
    const category = await Category.create({name:name});
    try{
        if (!category) {
            const error = new Error('category not created');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({category: category,status:true });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.question = async (req, res, next) => {
    let question, allQuestion = [];
    console.log(req.body);
    try{
    // console.log(JSON.parse(req.body.question));
    for(j of req.body){
    if(j.correct == "first_option" || j.correct == "second_option" 
    || j.correct == "third_option" || j.correct == "fourth_option"){
        question = await Question.create({
        name: j.name,
        first_option: j.first_option,
        second_option: j.second_option,
        third_option: j.third_option,
        fourth_option: j.fourth_option,
        correct: j.correct,
        categoryId : j.categoryId
    });
    }else{
        const error = new Error('please give one of fields from above...');
        error.statusCode = 400;
        throw error;
    }
        if (!question) {
            const error = new Error('question not created');
            error.statusCode = 400;
            throw error;
        }
        allQuestion.push(question);
    }
        res.status(200).json({
            question: allQuestion,
            status:true });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.first_page = async (req, res, next) => {
    const category = await Category.findAll();
    console.log(req.userId);
    try{
        if (!category) {
            const error = new Error('category not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({category: category,status:true });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }    
}

exports.second_page = async (req, res, next) => {
    const categoryId = req.params.id;
    const question = await Question.findAll({where: {categoryId: categoryId}});
    try{
        if (!question) {
            const error = new Error('question not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({question:question ,status:true});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    } 
}

exports.answer = async (req, res, next) => {
  const userId = req.userId;
  let test, answer,correctAnswer = 0, inCorrectAnswer = 0, skip=0,totalAnswer,qualified;
  let categoryId;
  const tests = await Student_test.findAll({where:{userId:userId}});
  for(t of tests){
    test = t.test_no;
  }
  if(!test){
    test = 1;
  }else{
    test+= 1;
  }
  for(an of JSON.parse(req.body.answer)){
    const allAnswer = await Question.findByPk(an.quizId);
    if(allAnswer.correct == an.answer){
        correctAnswer++;
    }else if(an.skip == 1){
        skip++;
    }else{
    inCorrectAnswer++;
    }
    const question = await Question.findByPk(an.quizId);
    categoryId = question.categoryId;
  }
  totalAnswer = correctAnswer+inCorrectAnswer+skip;
  let percentage = (correctAnswer/totalAnswer)*100;
  if(percentage >= 50){
    qualified = 1;
  }else{
    qualified = 0;
  }
  const user = await User.findByPk(userId);
  if(!(user.stream)){
    if(categoryId == 1){
        user.stream = user.stream+"1";
        }else if(categoryId == 2){
            console.log(categoryId);
            user.stream = user.stream+"2";
        }else{
            user.stream = user.stream+"3";
        }
  }else if(!(user.stream.includes("1"))){
    console.log(categoryId);
    if(categoryId == 1){
    user.stream = user.stream+",1";
    }
  }else if(!(user.stream.includes("2"))){
    if(categoryId == 2){
        user.stream = user.stream+",2";
        }
  }else if(!(user.stream.includes("3"))){
    if(categoryId == 3){
        user.stream = user.stream+",3";
        }
  } 
  await user.save();
  const student_test = await Student_test.create({
    test_no:test,
    percentage:percentage,
    correct:correctAnswer,
    incorrect:inCorrectAnswer,
    skip:skip,
    qualified:qualified,
    categoryId:categoryId,
    userId:userId
  })
  try{
    if (!student_test) {
        const error = new Error('student_result not create');
        error.statusCode = 400;
        throw error;
    } 
  for(ans of JSON.parse(req.body.answer)){
    answer = await Answer.create({
        answer: ans.answer,
        test: test,
        skip: ans.skip,
        userId:userId,
        questionId: ans.quizId
      });
    if (!answer) {
        const error = new Error('answer not create');
        error.statusCode = 500;
        throw error;
    }
}
res.status(200).json({test:student_test,status:true}); 
}catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}  
} 

exports.getUser = async (req, res,next) => {
    const user = await User.findAll({where:{type:'student'}});
    try{
        if (!user) {
            const error = new Error('user not found');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({user:user,status:true});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }  
}

exports.getSpecificUser = async (req, res, next) => {
    const userId = req.params.id;
    const user = await Student_test.findAll({where: {userId: userId}});
    try{
        if (!user) {
            const error = new Error('test not found');
            error.statusCode = 404;
            throw error;
        }   
    res.status(200).json({user:user,status:true});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }    
}

exports.allTest = async (req, res, next) => {
    const userId = req.userId;
    let tests = [],a,t,allTest=[];
    const test = await Answer.findAll({where: {userId: userId},include:Question});
    try{
        if (!test) {
            const error = new Error('answer not found');
            error.statusCode = 400;
            throw error;
        }  
        for(t of test){
            total = t.test;
        }
        for(i=1;i<=total;i++){
           a = await Answer.findAll({where: {test:i}});
           for(aa of a){
           tests.push(aa.test);
           }
        }
        console.log(tests);
        let s = new Set(tests);
        for(ss of s){
            allTest.push(ss);
        }
        res.status(200).json({test:allTest,status:true});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }    
    }
    
exports.gettestQuestion = async (req, res, next) => {
    const testId = req.params.id;
    console.log(req.userId);
    const answer = await Answer.findAll({where:{test:testId},include:Question});
    try{
        res.status(200).json({test:answer,status:true});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }     
}

exports.logout = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    try{
        if(!user){
            const error = new Error('user not found');
            error.statusCode = 400;
            throw error;
        }
        user.token = '';
        await user.save();
        res.status(200).json({message:"logout sucessfully",status:"true"});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    } 
}

exports.getCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    console.log(categoryId);
    const category = await Category.findByPk(categoryId);
    try{
        if(!category){
            const error = new Error('category not found');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({category:category,status:true});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }    
}

exports.postCategory = async (req, res, next) => {
    const categoryId = req.body.categoryId;
    const category = await Category.findByPk(categoryId);
    try{
        if(!category){
            const error = new Error('category not found');
            error.statusCode = 400;
            throw error;
        }
        category.name = req.body.name;
        const updateCategory = await category.save();
        res.status(200).json({category:updateCategory,status:true});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }    
}

exports.getQuestion = async (req, res, next) => {
    const questionId = req.params.id;
    const question = await Question.findByPk(questionId);
    try{
        if(!question){
            const error = new Error('question not found');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({question:question,status:true});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }   
}

exports.postQuestion = async (req, res, next) => {
    const questionId = req.body.questionId;
    const question = await Question.findByPk(questionId);
    try{
        if(!question){
            const error = new Error('question not found');
            error.statusCode = 400;
            throw error;
        }
        question.name = req.body.name;
        question.first_option = req.body.first_option;
        question.second_option = req.body.second_option;
        question.third_option = req.body.third_option;
        question.fourth_option = req.body.fourth_option;
        question.correct = req.body.correct;
        question.categoryId = req.body.categoryId;
        const updateQuestion =  await question.save();
        res.status(200).json({question:updateQuestion,status:true});
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }   
}

exports.dashboard = async (req, res, next) => {
    let htmlStudents = [], cssStudents = [],jsStudents = [], htmlQuestion =0,cssQuestion=0,jsQuestion=0;
    const user = await User.findAll({where:{type:"student"}});
    const test = await Student_test.findAll();
    for(t of test){
        if(t.categoryId == 1 ){
            jsStudents.push(t.userId);
        }else if(t.categoryId == 2){
            htmlStudents.push(t.userId);
        }else{
            cssStudents.push(t.userId);
        }
    }
    let hStudents = new Set(htmlStudents);
    let cStudents = new Set(cssStudents);
    let jStudents = new Set(jsStudents);

    let question = await Question.findAll();

    for(q of question){
        if(q.categoryId == 1 ){
            jsQuestion++;
        }else if(q.categoryId == 2){
            htmlQuestion++;
        }else{
            cssQuestion++;
        }
    }

    console.log(jsQuestion, htmlQuestion, cssQuestion);
    try{
        res.status(200).json({
            student:user.length,
            htmlStudents:hStudents.size,
            cssStudents:cStudents.size,
            jsStudents: jStudents.size,
            htmlQuestion:htmlQuestion,
            cssQuestion:cssQuestion,
            jsQuestion:jsQuestion,
            status:true
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    } 
}

exports.getUserProfile = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    try{
        if(!user){
            const error = new Error('user not found');
            error.statusCode(404);
            throw error;
        }
        res.status(200).json({user:user});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }   
}