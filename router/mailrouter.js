// const express=require('express');
// const routerr=express.Router();
// const email_controll=require('../controllers/mailServer.controller');

// routerr.get('/email',email_controll.readmails);

// routerr.get("/emails/:id", email_controll.read_single_mail);
// // show reply
// routerr.get('/reply/:id', email_controll.get_reply);
// // send reply
// routerr.post('/reply/:id', email_controll.send_reply);


// module.exports=routerr;

const express = require('express');
const routerr = express.Router();
const email_controll = require('../controllers/mailServer.controller');

// List all emails
routerr.get('/email', email_controll.readmails); // ✅ No change needed

// Read single email
routerr.get('/emails/:id', email_controll.read_single_mail); // ✅ Frontend link must match /emails/:id

// Show reply form
routerr.get('/reply/:id', email_controll.get_reply); 
// ✅ Make sure frontend button href="/reply/<%= mail.uid %>"
// ✅ Backend get_reply converts uid to string for correct find

// Send reply
routerr.post('/send-reply', email_controll.send_reply); 
// ✅ Frontend form action="/reply/<%= mail.uid %>" method="POST"
// ✅ Ensure form fields: to, subject, message

module.exports = routerr;
