const express = require("express");
const {User, Collection, Category, SubCategory, Product} = require("./models");

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    // console.log(req)
    res.send('Welcome to BareSKN');
})

app.post('/users', async(req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send(user)
    }catch (err) {
        res.status(400).send(err)
    }
})

app.get('/users', async (req, res) => {
    const users = await User.find({});

    try{
        res.send(users);
    }catch(err){
        res.status(404).send(err)
    }
})

// Get all the collections 
app.get('/collections', async(req, res) => {
    const collections = await Collection.find({});
    try{
        res.send(collections);
    }catch(err){
        res.status(404).send(err);
    }
})

// Get collection by key
app.get('/collections/:key', async (req, res) => {
    const { key } = req.params;
    const collection = await Collection.find({key})
    try{
        res.send(collection);
    }catch(err){
        res.status(404).send(err);
    }
})

// Create new collection
app.post('/collections', async(req, res) => {
    const collection = new Collection(req.body)
    try{
        await collection.save();
        res.send(collection)
    } catch(err) {
        res.status(500).send(err);
    }
})

// Get all categories
app.get('/categories', async(req, res) => {
    const categories = await Category.find({});
    try{
        res.send(categories)
    }catch(err){
        res.status(404).send(err);
    }
})

// Get category by key
app.get('/categories/:key', async (req, res) => {
    return;

})


// Create new category
app.post('/categories', async(req, res) => {
    const category = new Category(req.body)
    try{
        await category.save();
        res.send(category)
    } catch(err) {
        res.status(500).send(err);
    }
})

// Get all the subcategories
app.get('/subcategories', async(req, res) => {
    const subCategories = await SubCategory.find({});
    try{
        res.send(subCategories)
    }catch(err){
        res.status(404).send(err);
    }
})

// Get all subcategories by category key
app.get('/subcategories/:category_key', async(req, res) => {
    const { category_key } = req.params;
    const category = await Category.find({key: category_key});
    const subCategories = await SubCategory.find({category_key});
    try {
        res.send({
            category : category[0].name,
            subCategories
        });
    }catch(err) {
        res.status(404).send(err);
    }
})

// Create new subcategory
app.post('/subcategories', async(req, res) => {
    const subCategory = new SubCategory(req.body)
    try{
        await subCategory.save();
        res.send(subCategory)
    } catch(err) {
        res.status(500).send(err);
    }
})

// Create new product
app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    try{
        await product.save();
        res.send(product);
    }catch(err) {
        res.status(500).send(err);
    }
})

// Get all products
app.get('/products', async(req, res) => {
    const products = await Product.find({});
    try{
        res.send(products);
    }catch (err) {
        res.status(404).send(err);
    }
})

// Get products by collection
app.get('/collections/:coll_key/products', async(req, res) => {
    const { coll_key } = req.params;
    const collection = await Collection.find({key: coll_key});
    const products = await Product.find({coll_keys: coll_key});
    try{
        res.send({
            collection: collection[0].name,
            products
        })
    }catch(err){
        res.status(404).send(err);
    }
})

// Get products by subcategory
app.get('/subcategories/:subcat_key/products', async(req, res) => {
    const { subcat_key } = req.params;
    const subCategory = await SubCategory.find({key: subcat_key});
    const products = await Product.find({subcat_keys: subcat_key});
    try {
        res.send({
            subCategory : subCategory[0].name,
            products,
            totalProducts: products.length
        });
    }catch(err) {
        res.status(404).send(err);
    }
})

module.exports = app;