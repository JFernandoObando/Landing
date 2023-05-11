const mongoose = require('mongoose');
const { connect } = require("mongoose");

(async()=>{
    try{
        console.log('works')
        const db = await connect("mongodb://127.0.0.1:27017/myDB")
        console.log('Db conected', db.connection.name)

    }catch(error){
        console.error(error);
    }

})();

