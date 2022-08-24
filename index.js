var express = require('express');
var app = express();

// 메모리 상태면 안되고 파일로 만들어준다
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
});

// 싱크 옵션을 비워둔다
(async () => {
await Comments.sync();
})();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('view engine', 'ejs');


// Read
  app.get('/', async function(req, res) {
    const comments = await Comments.findAll();

    res.render('index', { comments: comments });
  });

// Create
  app.post('/create', async function(req, res) {
    console.log(req.body)

    const { content } = req.body

  await Comments.create({ content: content });

    res.redirect('/')
  });

// Update
  app.post('/update/:id', async function(req, res) {
    console.log(req.params)
    console.log(req.body)

    const { content } = req.body
    const { id } = req.params

  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });

    res.redirect('/')
  });

// Delete
  app.post('/delete/:id', async function(req, res) {
    console.log(req.params)
    const { id } = req.params

    await Comments.destroy({
      where: {
        id: id
      }
    });

    res.redirect('/')
  });
  
app.listen(3000);
console.log('Server is listening on port 3000');