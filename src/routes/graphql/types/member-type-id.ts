import { GraphQLScalarType, Kind } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';

const isMemberTypeId = (value: unknown): value is MemberTypeId =>
  typeof value === 'string' && Object.values(MemberTypeId).includes(value as MemberTypeId);

export const MemberTypeIdType = new GraphQLScalarType({
  name: 'MemberTypeId',
  serialize(value) {
    if (!isMemberTypeId(value)) {
      throw new TypeError(`Invalid MemberTypeId: ${value}`);
    }
    return value;
  },
  parseValue(value) {
    if (!isMemberTypeId(value)) {
      throw new TypeError(`Invalid MemberTypeId: ${value}`);
    }
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (isMemberTypeId(ast.value)) {
        return ast.value;
      }
    }
    return undefined;
  },
}); 