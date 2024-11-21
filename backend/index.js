const express =require("express")
const cors = require("cors")
const app =express()
const mongoose=require("mongoose")
app.use(express.json())
app.use (cors())

mongoose.connect("mongodb+srv://ragul:1234@cluster0.eriu4.mongodb.net/passkeys?retryWrites=true&w=majority&appName=Cluster0").then(function(){
  console.log("Connected to MongoDb")
}).catch(function(){
  console.log("Failed to connect in DB")
})

const credential=mongoose.model("credential",{},"bulkmail")




const nodemailer = require("nodemailer");




app.post("/sendmail",function(req,res){

  var msg=req.body.msg
  var emailList=req.body.emailList

  credential.find().then(function(data){
    const transporter = nodemailer.createTransport({
      service:"gmail",
        
         auth: {
         user: data[0].toJSON().user,
         pass: data[0].toJSON().pass,
         
       },
       
     });
  
  
     new Promise(async(resolve, reject) => {
      
      try{
        for (var i=0;i<emailList.length;i++)
          {
            await  transporter.sendMail({
                  from: "ragulramadoss17@gmail.com",
                  to: emailList[i], 
                  subject: "Message from Bulk mail", 
                  text: msg
                    },
                  );
                  console.log("Email is send to "+emailList[i])
                }
                resolve("Success")
      }
      catch(error)
      {
        reject("Failed")
      }
    }).then(function(){
      res.send(true)
    }).catch(function(){
      res.send(false)
    })
  
  }).catch(function(error){
    console.log(error)
  })
  console.log(msg)

  

})
  
app.listen(5000,function(){
    console.log("Server Started")
})