const mongoose = require('mongoose')

const getConnection = ()=>{
    // Use MONGO_URI from environment when available, otherwise fall back to localhost.
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/userInfo'

    mongoose.connect(uri).then(()=>{
        console.log('Database is connected')
    }).catch((err)=>{
        console.error('Failed to connect to Database', err.message || err)
    })

}

module.exports = getConnection