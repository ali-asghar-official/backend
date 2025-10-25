const User = require("./User")
const bcrypt = require("bcrypt")


async function createAdminAccount() {
    try {
        const existingAdmin = await User.findOne({email: "admin@test.com"});
        if (!existingAdmin) {
            const newAdmin = new User({
                email: "admin@test.com",
                name:"Admin",
                password: await bcrypt.hash("admin", 10),
                role:"admin"
            })
            await newAdmin.save();
            console.log("Admin Created Successfully")
        }
        else {
            console.log("Admin already existed")
        }
        
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = createAdminAccount;