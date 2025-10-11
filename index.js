const express = require('express')
const getConnection = require('./getConnection')
const cors = require('cors')
const UserData = require('./User')
const saveUserData = require('./saveUserData')
const addProduct = require('./addProduct')
const UploadFile = require('./UploadFile')
const path = require('path')
const Product = require('./Product')
const Category = require('./Category')
const Brand = require('./Brand')
const User = require('./User')
const bcrypt = require('bcrypt')
const Todo = require('./Todo')


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/images',express.static(path.join(__dirname,'images')))

app.post('/user/data',saveUserData)
app.post('/product/add',addProduct)


app.get('/product/list', async (req, res, next) => {
  try {
    const list = await Product.find().populate('category');
    res.status(200).json({ list });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

app.delete('/product/delete', async(req,res,next)=>{

  const id = req.query.id
  
await Product.findByIdAndDelete(id)
res.status(200).json({message:'Product Deleted'})

})

app.get('/single/product', async(req,res,next)=>{

    const id = req.query.id
  const singleProduct = await Product.findById(id)
  
  res.status(200).json({message:'success',item:singleProduct})

})

app.get('/category/entry', async(req,res,next)=>{

    const id = req.query.id
  const categoryEntry = await Product.findById(id)
  
  res.status(200).json({message:'success',item:categoryEntry})

})


app.post('/image/upload',UploadFile,(req,res,next)=>{

res.status(201).json({message:'success',file:req.file.path})

})


app.put('/product/update',async(req,res,next)=>{

  const name = req.body.name
  const price = req.body.price
  const category = req.body.category
  const brand = req.body.brand
  const detail = req.body.detail
  const file = req.body.preview

  const id = req.query.id
  const findedProduct = await Product.findById(id)
  

  findedProduct.name = name
  findedProduct.price = price
  findedProduct.category = category
  findedProduct.brand = brand
  findedProduct.detail = detail
  findedProduct.image = file ? file : findedProduct.image
 
  await findedProduct.save()
  res.status(200).json({message:'Product Updated'})
})


app.post('/category/add',async(req,res,next)=>{

  const title = req.body.title
  const file = req.body.file
  
  const newCategory = new Category({
    title:title,
    image:file
  })
  const savedCategory = await newCategory.save()
  res.status(201).json({message:'Category Created'})

})

app.get('/receive/category',async(req,res,next)=>{

  const list = await Category.find()

  res.status(200).json({list})

})


app.get('/category/list',async(req,res,next)=>{

  const list = await Category.find()

  res.status(200).json({list})

})

app.get('/category/single',async(req,res,next)=>{
  const id = req.query.id
 
  
  const findedCat = await Category.findById(id)
  
  res.status(200).json({findedCat})
})

app.put('/category/update',async(req,res,next)=>{
  const id = req.query.id
  const title = req.body.title
  const file = req.body.file
 
  
  const findedCat = await Category.findById(id)
  console.log(findedCat)
  findedCat.title = title
  findedCat.image = file
  await findedCat.save()
  res.status(200).json({message:'Category Updated'})
  
})

app.delete('/category/delete', async(req,res,next)=>{

  const id = req.query.id
  
await Category.findByIdAndDelete(id)
res.status(200).json({message:'Category Deleted'})

})


app.post('/brand/add',async(req,res,next)=>{

  const title = req.body.title
  const file = req.body.file
  
  const newBrand = new Brand ({
    title:title,
    image:file
  })
  const savedBrand = await newBrand.save()
  res.status(201).json({message:'Brand Created'})

})

app.get('/receive/brand',async(req,res,next)=>{

  const list = await Brand.find()

  res.status(200).json({list})

})


app.get('/brand/list',async(req,res,next)=>{

  const list = await Brand.find()

  res.status(200).json({list})

})

app.delete('/brand/delete', async(req,res,next)=>{

  const id = req.query.id
  
await Brand.findByIdAndDelete(id)
res.status(200).json({message:'Brand Deleted'})

})



app.get('/brand/single',async(req,res,next)=>{
  const id = req.query.id
 
  
  const findedBrand = await Brand.findById(id)
  
  res.status(200).json({findedBrand})
})

app.put('/brand/update',async(req,res,next)=>{
  const id = req.query.id
  const title = req.body.title
  const file = req.body.file
 
  
  const findedBrand = await Brand.findById(id)
  console.log(findedBrand)
  findedBrand.title = title
  findedBrand.image = file
  await findedBrand.save()
  res.status(200).json({message:'Brand Updated'})
  
})





app.get('/product/by/category', async (req, res, next) => {
  try {
    const catId = req.query.id;
    console.log("Category ID:", catId);

    const list = await Product.find({ category: catId }).populate("category");
    console.log("Products by category:", list);

    res.status(200).json({ list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


app.get('/product/search', async(req,res,next)=>{

const name = req.query.name

const list = await Product.find({name:{$regex:name,$options:'i'}})

console.log(list)
res.status(200).json({message:'success',list})

})


app.post('/user/register',async(req,res,next)=>{

const {name,email,password} = req.body

const findedUser = await User.findOne({email:email})
if(findedUser){
  return res.status(404).json({message:'This user is alreay existed'}) 

}


const hashedPassword =  await bcrypt.hash(password,10)

const newUser = new User({
  name:name,
  email:email,
  password:hashedPassword
})

const savedUser = await newUser.save()


res.status(200).json({message:'Account Registered Successfully'})

})


app.post("/todo/add", async(req,res,next) => {

  const title = req.body.title;
  
  const newTodo = new Todo({ 
    title:title

   });

    const savedTodo = await newTodo.save();
    res.status(201).json({message:'Item added successfully'})
});

app.get('/receive/todo',async(req,res,next)=>{

    const todos = await Todo.find();
    res.json(todos);
})

app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: "Todo deleted successfully" });
});

app.put("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { title: title },
    { new: true } // return updated todo
  );

  res.json({ message: "Todo updated successfully", todo: updatedTodo });
});





getConnection()
app.listen(5000,()=>console.log('Server is running on port :5000'))
