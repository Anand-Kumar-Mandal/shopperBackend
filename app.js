const dotenv = require('dotenv');
const express = require('express');
const app = express();

dotenv.config({ path: './config.env' });
require('./db/conn');

app.use(express.json());

//we link the router file s to make our route
app.use(require('./router/auth'));

//2: step
const PORT = process.env.PORT || 8000;

//3: step
if (process.env.NODE_ENV == "production") {
    app.use(express.static("/build"))
}

app.listen(PORT, () => {
    console.log(`server is running in port ${PORT} `)
})