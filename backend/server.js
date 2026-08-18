import { config } from './src/config/config.js'
import server from './src/app.js'
import connectDB from './src/db/db.js';

connectDB();

server.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});