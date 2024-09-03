const express = require('express')
const app = express()
const port = 8000

// MongoDb Connection
const connectDB = require('./config/db');
connectDB();

// connect user collection
const userModel = require(`./models/userModel`);
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(express.urlencoded())


const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const multer = require('multer');

const { unlinkSync } = require('fs');

const st = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        const uniqname = Date.now();
        cb(null,file.fieldname+'-'+uniqname)
    }
})

const fileUplad = multer({ storage: st }).single('image');

app.get('/view',(req,res) =>{
    userModel.find({})
    .then((detail) => {
        return res.render('View',{
            detail
        })
    })
})

app.get('/',(req,res) =>{

    return res.render('Add')
})
app.post('/insertDetail', fileUplad,(req,res) =>{

    const {name,price,pages,author} = req.body
    userModel.create({
        name:name,
        price:price,
        pages:pages,
        author:author,
        image :req.file.path
    })
    .then((data) =>{
        console.log(data);
        return res.redirect('/View')
    })  
    .catch((err) =>{
        console.log(err);
        return false;

    })  
})

// delete 
app.get('/delete/',(req,res) =>{
    const delid = req.query.deletId;

    // unlink 
    userModel.findById(delid)
    .then((single) =>{
        fs.unlinkSync(single.image)
    })
    .catch((err) =>{
        console.log(err);
        return false;

    })
        userModel.findByIdAndDelete(delid)
        .then((res) =>{

            return res.redirect('/View')

        })
        .catch((err) =>{
            console.log(err);
            return false;

        })
        
})
// editid
app.get('/edit',(req,res) =>{
    const eid = req.query.editId;
    userModel.findById(eid)
    .then((single) =>{        
        return res.render('Edit',{
            single
        })
    })
})
// update
app.post('/updatetDetail',fileUplad, (req,res) =>{
    const {editid,name,price,pages,author} = req.body
    if(req.file){
        userModel.findById(editid)
        .then((single) =>{

            fs.unlinkSync(single.image)

        })
        .catch((err) =>{
            console.log(err);
            return false;
        })
        userModel.findByIdAndUpdate(editid,{
            name:name,
            price:price,
            pages:pages,
            author:author,
            image :req.file.path
        })
        .then((data) =>{
            return res.redirect('/View')
            
        })
        .catch((err) =>{
            console.log(err);
            return false;
        })

    }else{
        userModel.findById(editid)
        .then((single) =>{
            userModel.findByIdAndUpdate(editid,{
                name:name,
                price:price,
                pages:pages,
                author:author,
                image:single.image
            })
            .then((data) =>{
                return res.redirect('/View')
            })
            .catch((err) =>{
                console.log(err);
                return false;

            })

        })
    }
    // userModel.findByIdAndUpdate(editId,{
    //     name:name,
    //     price:price,
    //     pages:pages,
    //     author:author,
    //     // image: req.file.path
    // })
    // .then((data) =>{
    //     console.log(data);
    //     return res.redirect('/View')

    // })
    // .catch((err) =>{
    //     console.log(err);
    //     return false;

    // })
})

app.listen(port,(err) =>{
    if(err){
        console.log(err);
        return false
    }
    console.log(`Server is running on port number :- ${port}`)
})