import { ApolloServer } from 'apollo-server-micro';
import { schema } from 'schema/schema';
import { NexusContext } from 'types/apiContextTypes';

const server = new ApolloServer({
  schema,
  context: (context: NexusContext) => {
    return context;
  },
});
const handler = server.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
