const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
var nodemailer = require('nodemailer');

PORT = 3000
const app = express()


const user = require('./model/user');


// mongodb connect
mongoose.connect('mongodb+srv://aswinkannur1:Aswinkannur01@cluster0.amfjccq.mongodb.net/ExitExam?retryWrites=true&w=majority', {useNewUrlParser:true})
.then(()=>{
    console.log('---------------MongoDB Connected---------------');
})
.catch((error)=>{
    console.log(error.message);
})



app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))


const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
 

function sendotp(email){


    // store data
    const newUser = new user({
        email: email,
        otp: otp
      });
  
    newUser.save();

  
    let mailTransporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'achuaswin703@gmail.com',
            pass:'sabhsxmgthjxgntv'
        }
    })

    let details = mailTransporter.sendMail({
        from:'achuaswin703', //enter your currect email
        to: email, //.....dont change.....
        subject:'Otp Verification', //enter your subject
        html: `Your OTP is: ${otp}` //enter your email
    });
}

 async function verifyOTP(email, otp) {

    const users = await user.findOne({ email }).exec();

    console.log(users);
  
    if (users.email === email && users.otp ===otp) {
       users.isLoggedIn = true;
      await users.save();
  
      console.log('success');
    } else {
      console.log('error');
    }
  
  }

app.post('/api/send-otp', async (req, res) => {
    let email = req.body.email
   
    await sendotp(email);
    res.json({status:'success'})
    console.log(otp);

    
    // res.redirect('/verify-otp');
  });
 
//   verify password
app.post('/api/verify-otp', async (req, res) => {
    let email = req.body.email
 
    console.log(email);
    console.log(otp);
    
    
    await verifyOTP(email, otp);
  
    // Redirect the user to the home page
    // res.redirect('/');
    res.json({status:"1"})
  });




  const path = require('path')

  app.use(express.static('./dist/frontend'));

  app.get("/*", function (req,res){
    res.sendFile(path.join(__dirname+ '/dist/frontend/index.html'))
  })




app.listen(PORT,()=>{
    console.log('----------------server runing----------------');
  })