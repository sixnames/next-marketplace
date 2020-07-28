import http from 'http';
import createApp from './app';
import { HTTP_PORT, MONGO_URL, SESS_OPTIONS } from './config';
import createInitialData from './utils/initialData/createInitialData';
import connectMongoDBStore from 'connect-mongodb-session';
import session from 'express-session';

(async () => {
  try {
    const { app, server } = await createApp();

    // Session
    const MongoDBStore = connectMongoDBStore(session);
    const store = new MongoDBStore({
      uri: MONGO_URL,
      collection: 'sessions',
    });
    const sessionHandler = session({
      store,
      ...SESS_OPTIONS,
    });
    app.use(sessionHandler);

    const httpServer = http.createServer(app);

    // Site initial data
    await createInitialData();

    httpServer.listen(HTTP_PORT, () => {
      console.log(`http://localhost:${HTTP_PORT}${server.graphqlPath}`);
    });
  } catch (e) {
    console.log('============ API FAILED ON START ============');
    console.error(e);
  }
})();
