import './index.css';
import axios from 'axios';
import React, { useState } from 'react';
import * as XLSX from "xlsx"



function App() {
const [msg,setMsg]=useState("")
const [status,setstatus]=useState(false)
const [emailList,setemailList]=useState([])


  function handleMsg(event){
    setMsg(event.target.value);
  }

  function handlefile(event){
    const file = (event.target.files[0])
    const reader=new FileReader()

    reader.onload=function(e){
        const data =e.target.result;
        const workbook= XLSX.read(data,{type:'binary'})
        const sheetName=workbook.SheetNames[0]
        const worksheet=workbook.Sheets[sheetName]
        const emailList=XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        const totalemail=emailList.map(function(item){return item.A})
        setemailList(totalemail)
  }
  reader.readAsBinaryString(file);
}


  function send(){
    setstatus(true)
    axios.post("http://localhost:5000/sendmail",{msg:msg,emailList:emailList})
    .then (function (data)
    {
      if(data.data=== true)
      {
        alert("Email send successfully")
        setstatus(false)
      }
      else
      {
        alert("Email doesn't send successfully")
      }
      })
    }
    
  


  return ( <>
    {/* Main Container with Full-Screen Gradient Background */}
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white flex flex-col items-center justify-center px-4 py-10 space-y-10">
      
      {/* Header Section */}
      <div className="text-center px-4 sm:px-6 md:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-wide">BulkMail</h1>
        <p className="text-md sm:text-lg font-light max-w-lg mx-auto text-gray-200">
          Streamline your business by sending multiple emails effortlessly!
        </p>
      </div>
  
      {/* Card for Content */}
      <div className="bg-white w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg  shadow-2xl p-6 sm:p-8 text-gray-800 space-y-6">
        
        {/* Drag and Drop Section */}
        <h3 className="text-lg sm:text-xl font-semibold text-center text-blue-900">Upload Your Email List</h3>
        
        {/* Message Input */}
        <textarea
          onChange={handleMsg}
          value={msg}
          className="w-full h-32 sm:h-40 p-4 border border-gray-300 rounded-lg resize-none outline-none placeholder-gray-400 focus:border-blue-500"
          placeholder="Enter the email content here..."
        ></textarea>
  
        {/* File Upload Input */}
        <div className="flex flex-col items-center">
          <input 
            type="file" 
            onChange={handlefile}
            className="border-2 border-dashed border-gray-300 w-full p-6 text-gray-600 bg-gray-50 rounded-lg cursor-pointer hover:border-blue-500 transition-all duration-300 ease-in-out"
          />
          <p className="text-gray-500 mt-2 font-medium">Emails in file: {emailList.length}</p>
        </div>
      </div>
  
      {/* Send Button */}
      <button
        onClick={send}
        className="py-2 px-6 sm:py-3 sm:px-10 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
      >
        {status ? "Sending..." : "Send"}
      </button>
    </div>
  </>
  );
}

export default App;
