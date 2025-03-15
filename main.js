/**
* server.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-04 initial version
*/
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./service/routes');
const fs = require('fs');
const https = require('https');
const http = require('http');
dotenv.config();

const app = express();
const port = process.env.PORT || 5050; //will look for in environment variables from the service file.
const portssl = process.env.PORTSSL || 5051; //will look for in environment variables from the service file.

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

//define the http server
const httpServer = http.createServer(app);

//define the https server
const httpsOptions = {
  cert: fs.readFileSync('/var/www/html/<page-directory>/cert/fullchain.cert'),
  key: fs.readFileSync('/var/www/html/<page-directory>/cert/privkey.key'),
};
const httpsServer = https.createServer(httpsOptions, app);

//open ports
httpServer.listen(port, () => {
  console.log(`HTTP Server is running on port ${port}`);
});

httpsServer.listen(portssl, () => {
  console.log(`HTTPS Server is running on port ${portssl}`);
});

