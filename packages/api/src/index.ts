import http from 'http';
import createApp from './app';
import { HTTP_PORT } from './config';

(async () => {
  try {
    const { app, server } = await createApp();

    const httpServer = http.createServer(app);
    httpServer.listen(HTTP_PORT, () => {
      console.log(`http://localhost:${HTTP_PORT}${server.graphqlPath}`);
    });
  } catch (e) {
    console.log('============ API FAILED ON START ============');
    console.error(e);
  }
})();
