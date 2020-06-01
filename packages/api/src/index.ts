import mongoose from 'mongoose';
import http from 'http';
import createApp from './app';
import { DB_URI, DB_OPTIONS, HTTP_PORT } from './config';
import createInitialData from './utils/createInitialData';

(async () => {
  try {
    const connection = await mongoose.connect(DB_URI, DB_OPTIONS);
    console.log('connection', connection);

    const { app, server } = createApp();

    const httpServer = http.createServer(app);

    await createInitialData();

    httpServer.listen(HTTP_PORT, () => {
      console.log(`http://localhost:${HTTP_PORT}${server.graphqlPath}`);
    });
  } catch (e) {
    console.error(e);
  }
})();
