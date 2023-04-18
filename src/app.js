const express = require("express");
const path = require("path");
const app = express();
const nodemailer = require('nodemailer')
// const hbs = require("hbs")
const ejs = require("ejs")
require("./db/connect")
const userModel = require('./models/student')
const Register = require('./models/register')
const feesModel = require('./models/fees')
const itModel = require('./models/addiit')
const updateModel = require('./models/update')
const otpModel = require('./models/otp')
const bcollegeModel = require('./models/bcollege')
const iimModel = require('./models/addiim')
const mbasModel = require('./models/mbastudent')
const mcollegeModel = require('./models/mbcollege')
const addaiimsModel = require('./models/addaiims')
const checkmbbsModel = require('./models/mbbsstudent')
var jwt = require('jsonwebtoken');
const { json } = require("express");
const { errorMonitor } = require("events");

const port = process.env.PORT || 3000;

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

 

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}




function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkexitemail = bcollegeModel.findOne({ email: email });
  checkexitemail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('college', { title: '', msg: 'Email Already Exist' });
    }
    next();
  });
}


function mcheckEmail(req, res, next) {
  var email = req.body.email;
  var checkexitemail = mcollegeModel.findOne({ email: email });
  checkexitemail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('mbacollege', {title:'', msg:'Email Already Exist' });
    }
    next();
  });
}



app.post('/mail', async (req,res)=> {
 
  const code = req.body.code;

  const checkUser = otpModel.findOne({ code:code });
  checkUser.exec((err, data) => {
   if(data) {
    const gmail= data.email;
    res.render('generate',{title:"Create New Password",msg:'',gmail:gmail})
   }
   else {
    res.render('forget',{ title: 'College Dunia', msg: '',succ:'',email:gmail,errors:'OTP NOT MATCHED' })
   }
  })

})


app.get("/", (req, res) => {
  res.render("index",{msg:''})
});

app.get("/gsuccess", (req, res) => {
  res.render("gsuccess")
});


app.get('/forget',  (req,res)=> {
  res.render('forget',{ title: 'College Dunia', msg: '',succ:'',email:'',errors:'' })
})
app.get('/generate',(req,res)=> {
  res.render("generate",{title:"Create New Password",msg:'',gmail:''})
})
app.post('/generate',async (req,res)=> {
  const email = req.body.gmail;
  const password = req.body.password;
  const confpassword = req.body.confpassword;
  if(!password || !confpassword) {
    res.render("generate",{title:"Create New Password",msg:'Please fill all details',gmail:''})
  }
  else {
    if(password == confpassword){
      
      const checkUser = userModel.findOne({ email:email });
      await checkUser.exec((err,data)=>{
        if(err) throw err
        const id = data._id;
        var passdelete = userModel.findByIdAndUpdate(id, { password:password,
 confirmpassword:confpassword });
        passdelete.exec(function (err) {
          if (err) throw err;
          res.render("generate",{title:"Create New Password",msg:'Password Reset successfully',gmail:''});
        });
      })
  
 
    }
    else {
      res.render("generate",{title:"Create New Password",msg:'Password and confirm password not matched',gmail:''});
    }
  }
})

app.post('/forget', async (req,res)=> {
  var email = req.body.email;
  var mnumber = req.body.mnumber;
  var minm = 100000;
  var maxm = 999999;
  var code = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  var expiryt = new Date().getTime() + 300*1000;
  const checkUser = bcollegeModel.findOne({ email:email });
  checkUser.exec((err, data) => {
   if(data.mnumber == mnumber){
    var userDetails = new otpModel({
      email:email,
      code:code,
      expiryt:expiryt
      
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('forget',{title:"college dunia", msg:"",succ:'OTP send in your mail',gmail:email,errors:''});
   
    });


    let transporter = nodemailer.createTransport({
    service:"gmail",
    auth : {
      user:"realvk4n@gmail.com",
      pass:"nwqshehsxatmvcys"
    },
    tls:{
      rejectUnauthorized:false
    }
  })
  
  let mailOptions = {
    from: "realvk4n@gmail.com",
    to: email,
    subject:"OTP FOR COLLEGE DUNIA",
    text:`Forget Password of College Dunia is :  ${code}`
  }

  transporter.sendMail(mailOptions,(err,success)=>{
  if(err) {
    throw err;
  }
  else {
    console.log("successfully sent")
  }
  })
  }
  else {
    res.render("forget",{title:"college dunia", msg:"Gmail or Mobile Number Wrong",succ:'',errors:''})
  }
  })
})


app.get('/pending',(req,res)=> {
  res.render('pending')
})


app.get('/full',(req,res)=> {
  res.render('full')
})


app.get('/blogin',(req,res)=>{
  res.render('blogin',{msg:''})
})

app.post("/blogin", (req, res) => {
  var username = req.body.username;
  const password = req.body.psw;
  const checkUser = bcollegeModel.findOne({ email: username });
  checkUser.exec((err, data) => {
    if (data == null) {
      res.render('blogin',{msg:'Student Not Exist'});
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
        if(username == "real" && password == "123456"){
          res.redirect('/admin')
        }
        else if(data.stuid == 1){
          res.redirect('/pending')
        }
        else {
          res.redirect('/student')
        }
        console.log("Succefully Loggedin")
      }
      else {
        res.render('blogin',{msg:'UserId and Password are not matched'});
        
      }
    }
  });

});

app.get('/llogin',(req,res)=>{
  res.render('llogin',{msg:''})
})

app.post("/llogin", (req, res) => {
  var username = req.body.username;
  const password = req.body.psw;
  const checkUser = bcollegeModel.findOne({ email: username });
  checkUser.exec((err, data) => {
    if (data == null) {
      res.render('llogin',{msg:'Student Not Exist'});
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
        if(username == "real" && password == "123456"){
          res.redirect('/admin')
        }
        else if(data.stuid == 1){
          res.redirect('/pending')
        }
        else {
          res.redirect('/student')
        }
        console.log("Succefully Loggedin")
      }
      else {
        res.render('llogin',{msg:'UserId and Password are not matched'});
        
      }
    }
  });

});


app.get('/mlogin',(req,res)=>{
  res.render('mlogin',{msg:''})
})

app.post("/mlogin", (req, res) => {
  var username = req.body.username;
  const password = req.body.psw;
  const checkUser = bcollegeModel.findOne({ email: username });
  checkUser.exec((err, data) => {
    if (data == null) {
      res.render('mlogin',{msg:'Student Not Exist'});
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
        if(username == "real" && password == "123456"){
          res.redirect('/admin')
        }
        else if(data.stuid == 1){
          res.redirect('/pending')
        }
        else {
          res.redirect('/student')
        }
        console.log("Succefully Loggedin")
      }
      else {
        res.render('mlogin',{msg:'UserId and Password are not matched'});
        
      }
    }
  });

});


app.get('/dlogin',(req,res)=>{
  res.render('dlogin',{msg:''})
})

app.post("/dlogin", (req, res) => {
  var username = req.body.username;
  const password = req.body.psw;
  const checkUser = bcollegeModel.findOne({ email: username });
  checkUser.exec((err, data) => {
    if (data == null) {
      res.render('dlogin',{msg:'Student Not Exist'});
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
        if(username == "real" && password == "123456"){
          res.redirect('/admin')
        }
        else if(data.stuid == 1){
          res.redirect('/pending')
        }
        else {
          res.redirect('/student')
        }
        console.log("Succefully Loggedin")
      }
      else {
        res.render('dlogin',{msg:'UserId and Password are not matched'});
        
      }
    }
  });

});



app.get('/admin', async (req, res) => {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser) {

 
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
}
else {
  res.redirect('/')
}
})

app.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'College Dunia', msg: '' });
});

app.get('/mbasignup', function (req, res, next) {
  res.render('mbasignup', { title: 'College Dunia', msg: '' });
});
app.get('/mbbsignup', function (req, res, next) {
  res.render('mbbsignup', { title: 'College Dunia', msg: '' });
});



app.get('/college', function (req, res, next) {
  res.render('college', { title: 'College Dunia', msg: '' });
});

app.get('/mbacollege', function (req, res, next) {
  res.render('mbacollege', { title: 'College Dunia', msg: '' });
});

app.get('/buser', function (req, res, next) {
  res.render('buser', { title: 'College Dunia', msg: '' });
});


app.post('/register', function (req, res, next) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var pnumber = req.body.pnumber;
  var feedback = req.body.feedback;
  var stuid = 1;

 if(!fname || !lname || !email || !pnumber || !feedback) {

  res.render('index',{msg:'Please Fill all the data'})
 }

 else {
    var userDetails = new Register({
      fname:fname,
      lname:lname,
      email:email,
      pnumber:pnumber,
      stuid:stuid,
      feedback:feedback
      
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.redirect('/gsuccess')
      console.log("successfully saved")
    });
  }
});


// This Part is a Payment Part 

app.post('/payment', function (req, res, next) {
  var name= req.body.fname;
  var card = req.body.card;
  var tid = Math.floor(Math.random() * 10000000);
  var stuid = 1;

    var userDetails = new feesModel({
      name:name,
      card:card,
      tid:tid,
      stuid:stuid
      
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.redirect('/success');
      console.log("successfully saved")
    });
  
});


app.post('/signup', function (req, res, next) {
 
  
  var jeemains = req.body.jeemains;
  var jeeadvanced = req.body.jeeadvanced;
  var phy = req.body.phy;
  var che = req.body.che;
  var math = req.body.math;
  const stuid = 1;
 
    var userDetails = new userModel({
   
      jeemains:jeemains,
      jeeadvanced:jeeadvanced,
      phy:phy,
      che:che,
      math:math,
      stuid:stuid
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      console.log("User Details Saved")
      res.redirect('/iit');
    });

});

app.post('/mbasignup', function (req, res, next) {
 
  
  
  var jeemains = req.body.jeemains;

  var phy = req.body.phy;
  var che = req.body.che;
  var math = req.body.math;
  const stuid = 1;
 
    var userDetails = new mbasModel({
    
      jeemains:jeemains,
    
      phy:phy,
      che:che,
      math:math,
     
      stuid:stuid
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      console.log("User Details Saved")
      res.redirect('/iim');
    });

});

app.post('/mbbsignup', function (req, res, next) {

  var jeemains = req.body.jeemains;
  var phy = req.body.phy;
  var che = req.body.che;
  var math = req.body.math;
  const stuid = 1;
 
    var userDetails = new checkmbbsModel({
    
      jeemains:jeemains,
      phy:phy,
      che:che,
      math:math,
     
      stuid:stuid
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      console.log("User Details Saved")
      res.redirect('/aiims');
    });

});



app.post('/college',checkEmail, function (req, res, next) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var mnumber = req.body.mnumber;
  var date = req.body.date;
  var month = req.body.month;
  var year = req.body.year;
  var gender = req.body.gender;
  var email = req.body.email;
  var address = req.body.address;
  var state = req.body.state;
  var city = req.body.city;
  var pincode = req.body.pincode;
  var jeemains = req.body.jeemains;
  var jeeadvanced = req.body.jeeadvanced;
  var phy = req.body.phy;
  var che = req.body.che;
  var math = req.body.math;
  var Graduation_Board = req.body.Graduation_Board;
  var Graduation_Percentage  = req.body.Graduation_Percentage;
  var Graduation_YrOfPassing = req.body.Graduation_YrOfPassing;
  var Masters_Board = req.body.Masters_Board;
  var Masters_Percentage  = req.body.Masters_Percentage;
  var Masters_YrOfPassing = req.body.Masters_YrOfPassing;
  var ClassXII_Board = req.body.ClassXII_Board;
  var ClassXII_Percentage  = req.body.ClassXII_Percentage;
  var ClassXII_YrOfPassing = req.body.ClassXII_YrOfPassing;
  var ClassX_Board = req.body.ClassX_Board;
  var ClassX_Percentage  = req.body.ClassX_Percentage;
  var ClassX_YrOfPassing = req.body.ClassX_YrOfPassing;
  var password = req.body.password;
  var college = req.body.college;
  const stuid = 1;
 
    var userDetails = new bcollegeModel({
      fname:fname,
      lname:lname,
      password:password,
      date:date,
      month:month,
      year:year,
      jeemains:jeemains,
      jeeadvanced:jeeadvanced,
      phy:phy,
      che:che,
      math:math,
      address:address,
      state:state,
      city:city,
      email:email,
      pincode:pincode,
      mnumber:mnumber,
     Graduation_Board:Graduation_Board,
     Graduation_Percentage:Graduation_Percentage,
     Graduation_YrOfPassing:Graduation_YrOfPassing,
     Masters_Board:Masters_Board,
     Masters_Percentage:Masters_Percentage,
     Masters_YrOfPassing:Masters_YrOfPassing,
     ClassXII_Board:ClassXII_Board,
     ClassXII_Percentage:ClassXII_Percentage,
     ClassXII_YrOfPassing:ClassXII_YrOfPassing,
     ClassX_Board:ClassX_Board,
     ClassX_Percentage:ClassX_Percentage,
     ClassX_YrOfPassing:ClassX_YrOfPassing,
      gender:gender,
      college:college,
      stuid:stuid
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      console.log("User Details Saved")
      res.redirect('/payment');
    });

});

app.post('/mbacollege',mcheckEmail, function (req, res, next) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var mnumber = req.body.mnumber;
  var date = req.body.date;
  var month = req.body.month;
  var year = req.body.year;
  var gender = req.body.gender;
  var email = req.body.email;
  var address = req.body.address;
  var state = req.body.state;
  var city = req.body.city;
  var pincode = req.body.pincode;
  var jeemains = req.body.jeemains;
  var Graduation_Board = req.body.Graduation_Board;
  var Graduation_Percentage  = req.body.Graduation_Percentage;
  var Graduation_YrOfPassing = req.body.Graduation_YrOfPassing;
  var Masters_Board = req.body.Masters_Board;
  var Masters_Percentage  = req.body.Masters_Percentage;
  var Masters_YrOfPassing = req.body.Masters_YrOfPassing;
  var ClassXII_Board = req.body.ClassXII_Board;
  var ClassXII_Percentage  = req.body.ClassXII_Percentage;
  var ClassXII_YrOfPassing = req.body.ClassXII_YrOfPassing;
  var ClassX_Board = req.body.ClassX_Board;
  var ClassX_Percentage  = req.body.ClassX_Percentage;
  var ClassX_YrOfPassing = req.body.ClassX_YrOfPassing;
  var password = req.body.password;
  var college = req.body.college;
  const stuid = 1;
 
    var userDetails = new mcollegeModel({
      fname:fname,
      lname:lname,
      password:password,
      date:date,
      month:month,
      year:year,
      jeemains:jeemains,
      address:address,
      state:state,
      city:city,
      email:email,
      pincode:pincode,
      mnumber:mnumber,
     Graduation_Board:Graduation_Board,
     Graduation_Percentage:Graduation_Percentage,
     Graduation_YrOfPassing:Graduation_YrOfPassing,
     Masters_Board:Masters_Board,
     Masters_Percentage:Masters_Percentage,
     Masters_YrOfPassing:Masters_YrOfPassing,
     ClassXII_Board:ClassXII_Board,
     ClassXII_Percentage:ClassXII_Percentage,
     ClassXII_YrOfPassing:ClassXII_YrOfPassing,
     ClassX_Board:ClassX_Board,
     ClassX_Percentage:ClassX_Percentage,
     ClassX_YrOfPassing:ClassX_YrOfPassing,
      gender:gender,
      college:college,
      stuid:stuid
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      console.log("User Details Saved")
      res.redirect('/payment');
    });

});


app.get("/approval", async (req, res) => {
  var loginUser = localStorage.getItem('loginUser');
  const getstu = bcollegeModel.find({});
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
  var passdelete = bcollegeModel.findByIdAndUpdate(id, { stuid: productid });
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/approval');
  });
});
app.get('/fourb/edit/:id', function (req, res, next) {
  var id = req.params.id;
  const productid = 2;
  var passdelete = bcollegeModel.findByIdAndUpdate(id, { stuid: productid });
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/approval');
  });
});



app.get("/check", async (req, res) => {
  var loginUser = localStorage.getItem('loginUser');
  const getR = Register.find({})
  try {

    let getr = await getR.exec()
    res.render('check',{rdata:getr})
  }
  catch(error) {
    throw error;
  }
});



app.get('/fourc/edit/:id', function (req, res, next) {
  var id = req.params.id;
  const productid = 0;
  var passdelete = feesModel.findByIdAndUpdate(id, { stuid: productid });
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/fee');
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
  var passdelete = Register.findByIdAndUpdate(id, { stuid: productid });
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/check');
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
app.get("/success",(req,res)=>{
  res.render('success')
})
app.get('/iit',async (req, res) => {

  const stdata = userModel.find({})
  const getstu = itModel.find({})

  try {
    let getdata = await getstu.exec(); 
    let stdatas = await stdata.exec();
    res.render('iit',{data:getdata,stdatas:stdatas})
  }
  catch(error) {
    throw error;
  }
})

app.get('/iim',async (req, res) => {

  const stdata = mbasModel.find({})
  const getstu = iimModel.find({})

  try {
    let getdata = await getstu.exec(); 
    let stdatas = await stdata.exec();
    res.render('iim',{data:getdata,stdatas:stdatas})
  }
  catch(error) {
    throw error;
  }
})

app.get('/addiim', (req, res) => {
  res.render('addiim',{msg:''})
})

app.post('/addiim',(req,res)=>{
  var rank = req.body.rank;
  const cat = req.body.cat;
  var cname = req.body.cname;
  var link = req.body.link;
  var fees = req.body.fees;
  var reviews = req.body.reviews;
  var address = req.body.address;
  var state = req.body.state;

    var userDetails = new iimModel({
     rank:rank,
     cname:cname,
     link:link,
     fees:fees,
     reviews:reviews,
     address:address,
     state:state,
     cat:cat 
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('addiim', { title: 'College', msg: 'College added successfully!' });
    });
})


app.get('/addiit', (req, res) => {
  res.render('addiit', { title: 'College', msg: '' })
})

app.post('/addiit',(req,res)=>{
  var rank = req.body.rank;
  const cat = req.body.cat;
  var cname = req.body.cname;
  var link = req.body.link;
  var fees = req.body.fees;
  var reviews = req.body.reviews;
  var address = req.body.address;
  var state = req.body.state;

    var userDetails = new itModel({
     rank:rank,
     cname:cname,
     link:link,
     fees:fees,
     reviews:reviews,
     address:address,
     state:state,
     cat:cat 
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('addiit', { title: 'College', msg: 'College added successfully!' });
    });
})

app.get('/addaiims', (req, res) => {
  res.render('addaiims', { title: 'College', msg: '' })
})

app.post('/addaiims',(req,res)=>{
  var rank = req.body.rank;
  const cat = req.body.cat;
  var cname = req.body.cname;
  var link = req.body.link;
  var fees = req.body.fees;
  var reviews = req.body.reviews;
  var address = req.body.address;
  var state = req.body.state;

    var userDetails = new addaiimsModel({
     rank:rank,
     cname:cname,
     link:link,
     fees:fees,
     reviews:reviews,
     address:address,
     state:state,
     cat:cat 
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('addaiims', { title: 'College', msg: 'College added successfully!' });
    });
})

app.get('/password-detail/delete/:id',function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id=req.params.id;
  var passdelete= itModel.findByIdAndDelete(passcat_id);
  passdelete.exec(function(err){
    if(err) throw err;
    res.redirect('/btech');
  });
});

app.get('/password-detailm/delete/:id',function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id=req.params.id;
  var passdelete= iimModel.findByIdAndDelete(passcat_id);
  passdelete.exec(function(err){
    if(err) throw err;
    res.redirect('/mba');
  });
});

app.get('/password-detaild/delete/:id',function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var passcat_id=req.params.id;
  var passdelete= addaiimsModel.findByIdAndDelete(passcat_id);
  passdelete.exec(function(err){
    if(err) throw err;
    res.redirect('/mbbs');
  });
});


app.get('/addmbapvt', (req, res) => {
  res.render('addmbapvt')
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

app.get('/btech', async (req, res) => {

  const record = itModel.find({});
  try {
    let records = await record.exec()
    res.render('btech',{records:records})
  }
  catch(err){
    throw Error;
  }
 
})

app.get('/mba', async (req, res) => {

  const record = iimModel.find({});
  try {
    let records = await record.exec()
    res.render('mba',{records:records})
  }
  catch(err){
    throw Error;
  }
 
})

app.get('/mbbs', async (req, res) => {

  const record = addaiimsModel.find({});
  try {
    let records = await record.exec()
    res.render('mbbs',{records:records})
  }
  catch(err){
    throw Error;
  }
 
})

app.get('/law', (req, res) => {
  res.render('law')
})


app.get('/ajee', (req, res) => {
  res.render('ajee')
})


app.get('/ajcutoff', (req, res) => {
  res.render('ajcutoff')
})

app.get('/student', async (req,res)=> {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser) {

  const getstu = userModel.find({});
  const gets = feesModel.find({})
  const data = updateModel.find({})
  const userdata = bcollegeModel.findOne({})
  try {
    let getdata = await getstu.exec(); 
    let fdata = await gets.exec();
    let udata = await userdata.exec();
    let updata = await data.exec()
    res.render('student',{data:getdata,mdata:fdata,udata:udata,updata:updata})
  }
  catch(error) {
    throw error;
  }
}
else {
  res.redirect('/')
}
})

app.get('/update', function (req, res, next) {
  res.render('update', { title: 'College Dunia', errors: '',success:"" });
});


app.post('/update', function (req, res, next) {
  var tname = req.body.tname;
  var content = req.body.content;
 
    var userDetails = new updateModel({
      tname:tname,
      content:content
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('update',{title: 'College Dunia',errors:"",success:"Successfully uploaded"});
      
    });
  
});


app.get('/payment',(req,res)=>{
  res.render('payment', { title: 'Payment', msg: '' })
})

app.get('/logout', function (req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});


app.listen(port, () => {
  console.log(`server is running at port no. ${port}`);
});
