const mongoose=require('mongoose')

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,

}).then(() => {
    console.log(`connection successful`);
}).catch((error) =>
    console.log(`no connection`));