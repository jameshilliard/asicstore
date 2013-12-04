var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");

var hogan = require("hogan.js");

var fs = require('fs');

var moment = require('moment');

var templ_customer_raw = fs.readFileSync("views/order.html").toString();
var templ_customer = hogan.compile(templ_customer_raw);

var templ_admin = hogan.compile("<h3>{{date}}: Server Down</h3><table>{{#servers}}<tr><td>{{url}}</td></tr>{{/servers}}</table>");

// setup e-mail data with unicode symbols
var mailOptions = {
  from: "ASICMiner Store<asicminer@block-erupter.com>" // sender address
  //    to: "naituida@foxmail.com, 496731243@qq.com, so_won315@163.com" // list of receivers
  // to : "naituida@foxmail.com"
  // subject: "Test Alert", // Subject line
  // text: "Fix Now", // plaintext body
  // html: "<b>Fix Now</b>" // html body
};


function send_html(addr,subject,html) {
  mailOptions.html = html;
  mailOptions.subject=subject;
  mailOptions.to = addr;
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log("Message sent: " + response.message);
    }
    smtpTransport.close(); 
  });
}

var moment = require('moment');

function toCustomer(order) {
  console.log(order);
  console.log("sending mail to customer");
  var date = moment( parseInt(order._id.toString().substring(0,8), 16 ) * 1000 );
  order.date=date.format('ddd, MMM d YYYY, H:mm:ss');
  var html = templ_customer.render(order);
  var subject = "Order Confirmation No. "+order.hash;
  send_html(order.email,subject,html);
}


function toStore(servers) {
  // send_html("Server Down",html);
}

exports.toCustomer = toCustomer;
exports.toStore = toStore;
