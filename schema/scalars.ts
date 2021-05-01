import { asNexusMethod, scalarType } from 'nexus';
import { Kind } from 'graphql';
import { ObjectId } from 'mongodb';
import {
  GraphQLJSONObject,
  GraphQLEmailAddress,
  GraphQLURL,
  GraphQLPhoneNumber,
} from 'graphql-scalars';

export const Json = asNexusMethod(GraphQLJSONObject, 'json');
export const Email = asNexusMethod(GraphQLEmailAddress, 'email');
export const Url = asNexusMethod(GraphQLURL, 'url');
export const Phone = asNexusMethod(GraphQLPhoneNumber, 'phone');

export const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const ObjectIdScalar = scalarType({
  name: 'ObjectId',
  asNexusMethod: 'objectId',
  description: 'Mongo object id scalar type',
  parseValue(value) {
    if (typeof value !== 'string' || !ObjectId.isValid(value)) {
      throw new Error('ObjectIdScalar can only parse string values');
    }
    return new ObjectId(value);
  },
  serialize(value) {
    if (!(value instanceof ObjectId)) {
      throw new Error('ObjectIdScalar can only serialize ObjectId values');
    }
    return value.toHexString();
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING || !ObjectId.isValid(ast.value)) {
      throw new Error('ObjectIdScalar can only parse string values');
    }
    return new ObjectId(ast.value);
  },
});
