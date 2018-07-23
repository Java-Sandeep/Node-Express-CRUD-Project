const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

// database connect
mongoose.connect('mongodb://localhost/NodeDB');
let db = mongoose.connection;

// check connection
db.on('open', () => {
	console.log("Connected to MongoDB ....!!!!");
});


// check for DB errors
db.on('error', (err) => {
	console.log(err);
});

// init application
const app = express();


// bring in models
let Article = require('./models/article');

//load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// body parser middleware
app.use(bodyparser.urlencoded({extended:false}))

// parse application/json
app.use(bodyparser.json());

// set public folder
app.use(express.static(path.join(__dirname,'public')));

// home route
app.get('/',(req,res) => {
	//res.send("hello");

	// rendring route to pug template without data
	//res.render('index');

	// let articles = [
	// 	{id:1, title:'Article one',author:'sandeep pal',body:'this is atricle one'},
	// 	{id:2, title:'Article two',author:'sandeep pal',body:'this is atricle two'},
	// 	{id:3, title:'Article three',author:'sandeep pal',body:'this is atricle three'}
	// ];

	Article.find({},(error,articles) => {
		if(error)
			console.log(error);
		else {
			res.render("index",{
				title : 'Articles',
				articles : articles
			});
		}
	});
	// rendring route to pug template with data
	//res.render('index',{'name':'sandeep'})

	// res.render("index",{
	// 	title:'Articles',
	// 	articles:articles
	// });
});

// Add Route
app.get('/articles/add',(req,res) => {
	res.render('add_article',{title:'Add Article'});
});

// add submit post route
app.post('/articles/add', (req,res) => {
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.blog;

	article.save(function(error){
		if(error){
			console.log(error);
			return;
		}else{
			res.redirect('/');
		}
	});
});

// start sever
app.listen(3000, () => {
	console.log("server started at prot no 3000");
});
