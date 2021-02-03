var express = require('express');
var app =express();
var mongoose = require('mongoose');
var path = require('path');
var fs = require("fs");
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var Orders = require('./models/order');
var Account = require('./models/account');
var moment = require('moment-timezone');

mongoose.connect('mongodb+srv://fullhouse:01253541920@cluster0.f2uso.mongodb.net/Data');
var db = mongoose.connection;

db.once('open',function(){
    console.log("Connect to mongodb server");
});
db.on('error',function(err){
    console.log(err);
});

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get('/',function(req,res){
  fs.readFile('data.json',function(err,data){
    var data = JSON.parse(data);
    res.render('index',{list:data});
  });
});

app.get('/milktea.html',function(req,res){
  fs.readFile('milktea.json',function(err,data){
    var data = JSON.parse(data);
    res.render('milktea',{list:data});
  });
});
app.get('/spicynoodles.html',function(req,res){
  fs.readFile('spicynoodles.json',function(err,data){
    var data = JSON.parse(data);
    res.render('spicynoodles',{list:data});
  });
});
app.get('/food.html',function(req,res){
  fs.readFile('food.json',function(err,data){
    var data = JSON.parse(data);
    res.render('food',{list:data});
  });
});

app.get('/cart.html',function(req,res){
  res.render('product');
});
app.get('/order.html',function(req,res){
  res.render('order');
});
app.post('/order',function(req,res){
  var option = {
    host:'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
      user: 'fullhouse.milktea@gmail.com',
      pass: 'fullhouse123'
    }
  };

  
  var transporter = nodemailer.createTransport(option);

  var timeZone = moment.tz("Asia/Ho_Chi_Minh");
  var date = timeZone.format("YYYY-MM-DD");
  var time = timeZone.format("HH:mm:ss");
  var year = timeZone.format("YYYY");
  var month = timeZone.format("MM");
  var day = timeZone.format("DD");
  var dateTime = date + " " + time;

  var mail = {
    from: 'fullhouse.milktea@gmail.com',
    to: req.body.email, 
    subject: 'FullHouse - Xác nhận đặt hàng',
    text: 'Thông tin đặt hàng: ' + "\n" +'Họ tên: '+req.body.name + "\n" +'Địa chỉ: '+req.body.address+"\n"+"Chi tiết đơn hàng: "+ req.body.detail+"\n"+"Thời gian: "+date +time +"\n"+'Tổng tiền: '+req.body.total +"\n"+"Cảm ơn quý khách và hẹn gặp lại"
  }
  transporter.sendMail(mail,function(err,info){
    if(err) throw err
    else{
      console.log("Email send: " + info.response);
    }
    transporter.close();
  });

  
  var order = new Orders();
  order.name = req.body.name;
  order.address = req.body.address;
  order.email = req.body.email;
  order.phone = req.body.phone;
  order.totalcost = req.body.total;
  order.year = year.toString();
  order.month = month.toString();
  order.day = day.toString();
  order.date = date.toString();
  order.time = time.toString();
  order.dateTime = dateTime.toString();
  order.save(function(err){
    if(err) throw err;
    console.log("Add success...");
    
  })
 
 res.render('result');  
});

app.get('/dashboard',function(req,res){
  Orders.find({},function(err,data){
    var total = 0;
    var temp;
    var myobj =[];
    for(var i = 0; i <data.length;i++){
      total += parseInt(data[i].totalcost);
    }
    var count  = data.length;
    for(var i = 0;i < data.length -1;i++){
      for(var j = i+1; j < data.length;j++ ){
        if(Date.parse(data[i].dateTime) < Date.parse(data[j].dateTime)){
            temp = data[i];
            data[i] = data[j];
            data[j] = temp;
        }
      }
    } 
    res.render('orderAll',{list:data,count:count,total:total})
  });
 
});

app.get('/ofDay',function(req,res){
  Orders.find({},function(err,data){
    if(err) throw err
    else{
     
      var total = 0;
      var temp;
      var myobj =[];
      var timeZone = moment.tz("Asia/Ho_Chi_Minh");
      var date = timeZone.format("YYYY-MM-DD");
      var time = timeZone.format("HH:mm:ss");
      var year = timeZone.format("YYYY");
      var month = timeZone.format("MM");
      var day = timeZone.format("DD");
      var dateTime = date + " " + time;
      for(var i= 0 ; i < data.length;i++){
       
        if(Date.parse(date) == Date.parse(data[i].date)){
          total += parseInt(data[i].totalcost);
          var obj = {
            name:data[i].name,
            address:data[i].address,
            email:data[i].email,
            phone:data[i].phone,
            totalcost:data[i].totalcost,
            dateTime:data[i].dateTime 
          }
          myobj.push(obj);
        }
      }
      var count = myobj.length;
      for(var i = 0;i < myobj.length -1;i++){
        for(var j = i+1; j < myobj.length;j++ ){
          if(Date.parse(myobj[i].dateTime) < Date.parse(myobj[j].dateTime)){
            temp = myobj[i];
            myobj[i] = myobj[j];
            myobj[j] = temp;
          }
        }
      }
      
      res.render('orderOfDay',{list:myobj,count:count,total:total,username:req.body.username});
     
    }
  });
  
 
});

app.get('/ofTime',function(req,res){
  Orders.find({},function(err,data){
    var total = 0;
      var temp;
      var myobj =[];
      
      for(var i = 0 ; i< data.length;i++){
        if(Date.parse(req.query.start) <= Date.parse(data[i].date) && Date.parse(data[i].date) <= Date.parse(req.query.end)){
          total += parseInt(data[i].totalcost);
          var obj = {
            name:data[i].name,
            address:data[i].address,
            email:data[i].email,
            phone:data[i].phone,
            totalcost:data[i].totalcost,
            dateTime:data[i].dateTime
          }
          myobj.push(obj);
        }
      }
      var count = myobj.length;
      for(var i = 0;i < myobj.length -1;i++){
        for(var j = i+1; j < myobj.length;j++ ){
          if(Date.parse(myobj[i].dateTime) < Date.parse(myobj[j].dateTime)){
            temp = myobj[i];
            myobj[i] = myobj[j];
            myobj[j] = temp;
          }
        }
      }
      res.render('orderOfTime',{list:myobj,count:count,total:total,username:req.body.username});
  });
});
app.get('/chartOfMonth',function(req,res){
  Orders.find({},function(err,data){
    var  count1 =0 ,count2= 0,count3 =0 ,count4 =0 ,count5 =0 ,count6 =0 ,count7 =0 ,count8 =0 ,count9 =0 ,count10 =0 ,count11 =0 ,count12 =0 ;
    var  total1 =0, total2 =0, total3 =0, total4 =0, total5 =0, total6 =0, total7 =0, total8 =0, total9 =0, total10 =0, total11 =0, total12 =0;
    var myobj = [];
    var mycount = [];
    var mytotal = [];
    var mymonth =[];
    for(var i = 0; i < data.length;i++){
       
      if(data[i].year == req.query.year){
          var obj = {
            name:data[i].name,
            address:data[i].address,
            email:data[i].email,
            phone:data[i].phone,
            date:data[i].date,
            month:data[i].month,
            year: data[i].year,
            totalcost:data[i].totalcost,
            dateTime:data[i].dateTime
          }
          myobj.push(obj);
      }
    }
    for(var i = 0 ; i < myobj.length;i++){
     if(parseInt(myobj[i].month) == 1){
       count1++;
       total1 += parseInt(myobj[i].totalcost); 
      }
      else if(parseInt(myobj[i].month) == 2){
        count2++;
        total2 += parseInt(myobj[i].totalcost); 
       }
       else if(parseInt(myobj[i].month) == 3){
        count3++;
        total3 += parseInt(myobj[i].totalcost); 
       }
       else if(parseInt(myobj[i].month) == 4){
        count4++;
        total4 += parseInt(myobj[i].totalcost); 
       }
       else if(parseInt(myobj[i].month) == 5){
        count5++;
        total5 += parseInt(myobj[i].totalcost); 
       }
       else if(parseInt(myobj[i].month) == 6){
        count6++;
        total6 += parseInt(myobj[i].totalcost); 
       }
       else if(parseInt(myobj[i].month) == 7){
        count7++;
        total7 += parseInt(myobj[i].totalcost); 
       }
       else if(parseInt(myobj[i].month) == 8){
        count8++;
        total8 += parseInt(myobj[i].totalcost); 
       }
       else if(parseInt(myobj[i].month) == 9){
        count9++;
        total9 += parseInt(myobj[i].totalcost); 
       }
       else if(parseInt(myobj[i].month) == 10){
        count10++;
        total10 += parseInt(myobj[i].totalcost); 
       }
       else if(parseInt(myobj[i].month) == 11){
        count11++;
        total11 += parseInt(myobj[i].totalcost); 
       }
       else if(parseInt(myobj[i].month) == 12){
        count12++;
        total12 += parseInt(myobj[i].totalcost); 
       }
      

    }
   mycount.push(count1,count2,count3,count4,count5,count6,count7,count8,count9,count10,count11,count12);
   mytotal.push(total1,total2,total3,total4,total5,total6,total7,total8,total9,total10,total11,total12);
   mymonth.push("Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",)
    res.render('chartOfMonth',{list1:mycount,list2:mytotal,list3:mymonth});
  
  });
});


 app.listen(process.env.PORT || 3000,function(){
    
    console.log("App is listening ");
});