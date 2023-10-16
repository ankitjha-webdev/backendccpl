const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
require('./config/sequalize.config');
const app = require('./app');

// console.log(app.get('env'));
console.log(process.env);

const port = process.env.PORT|| 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server has started at ${port}!!`);
});