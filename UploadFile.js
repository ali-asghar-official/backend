const multer = require('multer')

const storage = multer.diskStorage({

destination:(req,file,cb)=>{
    cb(null,'images')
},

filename:(req,file,cb)=>{
    const num = Math.floor(Math.random()*1e9)
    cb(null,file.fieldname+num+file.originalname)
}

})

const upload = multer({storage: storage}).single('image')
module.exports = upload

