const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const productRoutes = require('./Router');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://wonhyoek:ab8975@cluster0.irlkt.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));



app.use(express.json());


app.use('/api/products', productRoutes);

// handling error middleware
app.use((error, req, res, next) => {
    res.status(500).json({message: error.message});
})


app.listen(port, () => 
    console.log(`Server running on http://localhost:${port}`));

module.exports = app;