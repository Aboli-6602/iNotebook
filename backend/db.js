const mongoose = require ("mongoose");
// const mongoURI = "mongodb+srv://aboli:aboli123@cluster0.pv2p0ek.mongodb.net/?retryWrites=true&w=majority";
// const mongoURI = "mongodb+srv://aboli:aboli123@cluster0.pv2p0ek.mongodb.net/test";
const mongoURI = "mongodb://127.0.0.1:27017/iNotebookDB"
const connectToMongo = ()=>{
    
        mongoose.connect(mongoURI).then(()=>{
            console.log("connected to mongodb");
        }).catch((err)=>{
            console.log(err);
        })
        
}

// connectToMongo

module.exports = connectToMongo;