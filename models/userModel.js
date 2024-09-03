const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    pages:{
        type:String,
        required:true
    },
    author:{
        type:String,
        require: true
    },
    image:{
        type:String,
        required:true
    }
})
const books = mongoose.model('books',userSchema);
module.exports = books;