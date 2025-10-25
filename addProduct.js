const Category = require('./Category')
const Product = require('./Product')

// Adds a product. If a category title is provided, we try to resolve it to an ObjectId
// so `Product.category` remains a proper ref. If not found, we store the raw value
// which keeps backwards compatibility with any existing behavior.
const addProduct = async (req, res, next) => {
    try {
        // Keep logging for debug, but avoid huge dumps in production
        console.log('addProduct payload:', { name: req.body.name, category: req.body.category })

        const name = req.body.name
        const price = req.body.price
        const category = req.body.category
        const brand = req.body.brand
        const detail = req.body.detail
        const file = req.body.preview

        let categoryValue = category
        if (category) {
            const findedCat = await Category.findOne({ title: category })
            if (findedCat) {
                categoryValue = findedCat._id
            }
        }

        const newProduct = new Product({
            name: name,
            price: price,
            category: categoryValue,
            brand: brand,
            detail: detail,
            image: file
        })

        const savedProduct = await newProduct.save()
        res.status(201).json({ message: 'Product is saved', productId: savedProduct._id })
    } catch (err) {
        console.error('addProduct error', err)
        res.status(500).json({ message: 'Failed to save product', error: err.message || err })
    }
}

module.exports = addProduct