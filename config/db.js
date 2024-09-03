const mongoose = require('mongoose')
const connectDB = async() =>{
    try {
        
        const conn = await mongoose.connect(
            `mongodb+srv://3383foramsavaliya:3383foramsavaliya@crud1.37gsqni.mongodb.net/Book-store`
        );
        console.log(`MongoDB Connected Successfully...${conn.connection.host}`);
    } catch (error) {
        console.error(error)
        return;
    }
}
module.exports = connectDB;