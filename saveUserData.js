const UserData = require('./User')

const saveUserData = async(req,res,next)=>{
const email = req.body.email
const password = req.body.password

const newUserData = new UserData({
    email:email,
    password:password
})

await newUserData.save()
res.status(201).json({message:'Your data is successfully saved'})

}
module.exports = saveUserData

