import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectId } from 'mongodb';

export const JsonObjectScalar = new GraphQLScalarType({
  name: 'JSONObject',
  description: 'JSON object',
  parseValue(value: string) {
    return JSON.parse(value); // value from the client input variables
  },
  serialize(value: ObjectId) {
    return JSON.stringify(value); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value); // value from the client query
    }
    return null;
  },
});
