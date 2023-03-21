const express = require("express");
const path = require("path");
const app = express();
// const hbs = require("hbs")
const ejs = require("ejs")
require("./db/connect")
const userModel = require('./models/student')
const Register = require('./models/register')
const feesModel = require('./models/fees')

var jwt = require('jsonwebtoken');
const { json } = require("express");
const { errorMonitor } = require("events");

const port = process.env.PORT || 5000;

const static_path = path.join(__dirname, "../public");
const temp_path = path.join(__dirname, "../templates/views");
// const part_path = path.join(__dirname, "../templates/partials");
// const part_path = path.join(__dirname, "../templates/partial");

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", temp_path)
// ejs.registerPartials(part_path);

function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch (err) {
    res.redirect('/');
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


function checkUsername(req, res, next) {
  var username = req.body.uname;
  var checkexitemail = userModel.findOne({ username: username });
  checkexitemail.exec((err, data) => {
    if (err) throw err;
    if (data) {

      return res.render('signup', { title: 'Restaurant Management System', msg: 'Username Already Exit' });
    }
    next();
  });
}

function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkexitemail = userModel.findOne({ email: email });
  checkexitemail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('signup', { title: 'Restaurant Management System', msg: 'Email Already Exit' });
    }
    next();
  });
}



app.get("/", (req, res) => {
  res.render("index")
});


app.post("/login", (req, res) => {
  var username = req.body.username;
  const password = req.body.psw;
  const checkUser = userModel.findOne({ username: username });
  checkUser.exec((err, data) => {
    if (data == null) {
      res.render('index');
    }
    else {
      if (err) throw err;
      var getUserID = data._id;
      var getPassword = data.password;
      console.log(getPassword)
      if (password === getPassword) {
        var token = jwt.sign({ userID: getUserID }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username);
        // var getUserID = data._id;
        console.log(getPassword)
        res.redirect('/admin')
        console.log("Succefully Loggedin")
      }
      else {
        res.render('index');
        console.log("Succefully Not Loggedin")
      }
    }
  });
});

app.get('/admin', async (req, res) => {
  var loginUser = localStorage.getItem('loginUser');
  const getstu = userModel.find({});
  const getR = Register.find({})
  try {
    let getdata = await getstu.exec(); 
    let getr = await getR.exec()
    res.render('admin',{data:getdata,rdata:getr})
  }
  catch(error) {
    throw error;
  }
})

app.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Password Management System', msg: '' });
});


app.post('/register', checkUsername, checkEmail, function (req, res, next) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var pnumber = req.body.pnumber;
  var stuid = 1;

    var userDetails = new Register({
      fname:fname,
      lname:lname,
      email:email,
      pnumber:pnumber,
      stuid:stuid
      
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('index');
      console.log("successfully saved")
    });
  
});


// This Part is a Payment Part 

// app.post('/payment', checkUsername, checkEmail, function (req, res, next) {
//   var name = req.body.name;
//   var tid = req.body.tid;
//   var stuid = 1;

//     var userDetails = new feesModel({
//       name:name,
//       tid:tid,
//       stuid:stuid
      
//     });
//     userDetails.save((err, doc) => {
//       if (err) throw err;
//       res.render('payment');
//       console.log("successfully saved")
//     });
  
// });


app.post('/signup', checkUsername, checkEmail, function (req, res, next) {
  var name = req.body.name;
  var mnumber = req.body.mnumber;
  var course = req.body.course;
  var college = req.body.college;
  var gender = req.body.gender;
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var confpassword = req.body.confirmpassword;
  const stuid = 1;
  if (password != confpassword) {
    res.render('signup', { title: 'Password Management System', msg: 'Password not matched!' });

  } else {

    var userDetails = new userModel({
      name:name,
      mnumber:mnumber,
      course:course,
      college:college,
      gender:gender,
      username: username,
      email: email,
      password: password,
      confirmpassword: confpassword,
      stuid:stuid
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('signup', { title: 'Password Management System', msg: 'User Registerd Successfully' });
    });
  }
});

app.get("/approval", async (req, res) => {
  var loginUser = localStorage.getItem('loginUser');
  const getstu = userModel.find({});
  const getR = Register.find({})
  try {
    let getdata = await getstu.exec(); 
    let getr = await getR.exec()
    res.render('approval',{data:getdata,rdata:getr})
  }
  catch(error) {
    throw error;
  }
});

app.get('/foura/edit/:id', function (req, res, next) {
  var id = req.params.id;
  const productid = 0;
  var passdelete = userModel.findByIdAndUpdate(id, { stuid: productid });
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/approval');
  });
});

app.get("/check", async (req, res) => {
  var loginUser = localStorage.getItem('loginUser');
  const getstu = userModel.find({});
  const getR = Register.find({})
  try {
    let getdata = await getstu.exec(); 
    let getr = await getR.exec()
    res.render('check',{data:getdata,rdata:getr})
  }
  catch(error) {
    throw error;
  }
});



app.get('/fourc/edit/:id', function (req, res, next) {
  var id = req.params.id;
  const productid = 0;
  var passdelete = Register.findByIdAndUpdate(id, { stuid: productid });
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/approval');
  });
});

app.get("/fee", async (req, res) => {
  var loginUser = localStorage.getItem('loginUser');
 
  const getstu = feesModel.find({})
  try {
    let getdata = await getstu.exec(); 
    res.render('fee',{data:getdata})
  }
  catch(error) {
    throw error;
  }
});

app.get('/fourb/edit/:id', function (req, res, next) {
  var id = req.params.id;
  const productid = 0;
  var passdelete = feesModel.findByIdAndUpdate(id, { stuid: productid });
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/approval');
  });
});


app.get("/cat", (req, res) => {
  res.render("cat")
});

app.get("/clat", (req, res) => {
  res.render("clat")
});

app.get("/iiit", (req, res) => {
  res.render("iiit")
});
app.get("/jee", (req, res) => {
  res.render("jee")
});

app.get("/jeecutoff", (req, res) => {
  res.render("jeecutoff")
});

app.get("/neet", (req, res) => {
  res.render("neet")
});

app.get("/nit", (req, res) => {
  res.render("nit")
});
app.get('/iit', (req, res) => {
  res.render('iit')
})
app.get('/iim', (req, res) => {
  res.render('iim')
})
app.get('/addiim', (req, res) => {
  res.render('addiim')
})
app.get('/addiit', (req, res) => {
  res.render('addiit')
})
app.get('/addiiit', (req, res) => {
  res.render('addiiit')
})
app.get('/addmbapvt', (req, res) => {
  res.render('addmbapvt')
})
app.get('/addnit', (req, res) => {
  res.render('addnit')
})
app.get('/addpvt', (req, res) => {
  res.render('addpvt')
})
app.get('/aiims', (req, res) => {
  res.render('aiims')
})
app.get('/bitscutoff', (req, res) => {
  res.render('bitscutoff')
})
app.get('/catcutoff', (req, res) => {
  res.render('catcutoff')
})
app.get('/cmat', (req, res) => {
  res.render('cmat')
})
app.get('/cmatcutoff', (req, res) => {
  res.render('cmatcutoff')
})
app.get('/gmat', (req, res) => {
  res.render('gmat')
})
app.get('/gmatcutoff', (req, res) => {
  res.render('gmatcutoff')
})
app.get('/iim', (req, res) => {
  res.render('iim')
})
app.get('/laws', (req, res) => {
  res.render('laws')
})
app.get('/mat', (req, res) => {
  res.render('mat')
})
app.get('/mbapvt', (req, res) => {
  res.render('mbapvt')
})
app.get('/mgovt', (req, res) => {
  res.render('mgovt')
})
app.get('/mpvt', (req, res) => {
  res.render('mpvt')
})
app.get('/neetcutoff', (req, res) => {
  res.render('neetcutoff')
})
app.get('/govtb', (req, res) => {
  res.render('govtb')
})

app.get('/pvtbtech', (req, res) => {
  res.render('pvtbtech')
})
app.get('/btech', (req, res) => {
  res.render('btech')
})
app.get('/mba', (req, res) => {
  res.render('mba')
})
app.get('/mbbs', (req, res) => {
  res.render('mbbs')
})
app.get('/law', (req, res) => {
  res.render('law')
})
app.get('/wbjee', (req, res) => {
  res.render('wbjee')
})
app.get('/ajee', (req, res) => {
  res.render('ajee')
})
app.get('/bits', (req, res) => {
  res.render('bits')
})
app.get('/bitscutoff', (req, res) => {
  res.render('bitscutoff')
})
app.get('/ajcutoff', (req, res) => {
  res.render('ajcutoff')
})
app.get('/wbcutoff', (req, res) => {
  res.render('wbcutoff')
})
app.get('/studentdashboard',(req,res)=> {
  res.render('studentdashboard')
})

app.listen(port, () => {
  console.log(`server is running at port no. ${port}`);
});
