const http = require('http');
const app = require('./src/app');
const config = require('./src/config/config');

const server = http.createServer(app);

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
