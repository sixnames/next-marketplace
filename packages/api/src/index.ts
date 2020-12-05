import http from 'http';
import createApp from './app';
import { HTTP_PORT } from './config';
import createInitialData from './utils/initialData/createInitialData';

(async () => {
  try {
    const { app, server } = await createApp();

    // Create initial data
    await createInitialData();

    const httpServer = http.createServer(app);
    httpServer.listen(HTTP_PORT, () => {
      console.log(`http://localhost:${HTTP_PORT}${server.graphqlPath}`);
    });
  } catch (e) {
    console.log('============ API FAILED ON START ============');
    console.error(e);
  }
})();
