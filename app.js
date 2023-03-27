const express = require('express');
const app = express();
const sequelize = require('./util/database');
app.use(express.json());
const cors = require("cors");
const {DataTypes} = require('sequelize');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const Category = require('./models/category');
const Question = require('./models/questions');
const Answer = require('./models/answers');
const Student_test = require('./models/student_test');

app.use(cors({
  allowedHeaders : "*",
  origin : "*"
}));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin','*');
//   res.setHeader('Access-Control-Allow-Methods','*');
//   res.setHeader('Access-Control-Allow-Headers','content-type');
//   if(req.method === 'OPTIONS'){
//     return res.sendStatus(200);
//   }
//   next();
// })

Category.hasMany(Question, {
    foriegnKey: {
      type: DataTypes.UUID,
      allowNull: false
    }
  });
Question.belongsTo(Category, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Answer, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Answer.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

Question.hasMany(Answer, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Answer.belongsTo(Question, { constraints: true, onDelete: 'CASCADE' });

Category.hasMany(Student_test, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Student_test.belongsTo(Category, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Student_test, {
  foriegnKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Student_test.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

app.get('/cors',(req, res) => {
  res.send("this has cors enable");
})

app.use(authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data,status:false });
});

sequelize.sync()
.then(server => {
    app.listen(3000, () => {
        console.log("server connected");
    })
})
.catch(err => console.log(err));
