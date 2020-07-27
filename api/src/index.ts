import mongoose from 'mongoose';
import http from 'http';
import createApp from './app';
import { DB_OPTIONS, HTTP_PORT, MONGO_URL } from './config';
import createInitialData from './utils/initialData/createInitialData';

(async () => {
  try {
    await mongoose.connect(MONGO_URL, DB_OPTIONS);

    const { app, server } = createApp();

    const httpServer = http.createServer(app);

    await createInitialData();

    httpServer.listen(HTTP_PORT, () => {
      console.log(`http://localhost:${HTTP_PORT}${server.graphqlPath}`);
    });
  } catch (e) {
    console.log('============ API FAILED ON START ============');
    console.error(e);
  }
})();
