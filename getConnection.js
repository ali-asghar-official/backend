const mongoose = require('mongoose')

const getConnection = ()=>{

mongoose.connect('mongodb://0.0.0.0:27017/userInfo').then(()=>{
    console.log('Database is connected')
}).catch(()=>{
    console.log('Failed to connect to Database')
})

}

module.exports = getConnection