const Category = require('./Category')
const Product = require('./Product')

const addProduct = async (req, res, next) => {
    console.log(req.body)

    const name = req.body.name
    const price = req.body.price
    const category = req.body.category
    const brand = req.body.brand
    const detail = req.body.detail
    const file = req.body.preview

    const findedCat = await Category.findOne({ title: category })

    const newProduct = new Product({
        name: name,
        price: price,
        category: category,
        // category: findedCat._id,
        brand: brand,
        detail: detail,
        image: file
    })
    const savedProduct = await newProduct.save()
    res.status(201).json({ message: 'Product is saved' })
}

module.exports = addProduct