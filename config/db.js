const mongoose = require('mongoose');
const dotenv = require('dotenv'); 
const connect = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log(`Mongoose Connected at ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}
module.exports = connect;