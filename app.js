const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const router = require('./app/product/routes');
require('./config/mongoose');

app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
//middleware static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1', router);
app.use((req, res)=>{
    res.status(404).json({
        status: 'failed',
        message: 'not found'
    })
})





app.listen(process.env.PORT || 5000, ()=>console.log('server running port 5000'));