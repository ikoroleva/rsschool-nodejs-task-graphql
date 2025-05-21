import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { MemberTypeGraphQL, PostGraphQL, ProfileGraphQL, UserGraphQL } from './types.js';
import { UUIDType } from './types/uuid.js';
import { MemberTypeIdType } from './types/member-type-id.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return graphql({
        schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma }
      }).then((result) => {
        return {
          data: result.data,
          errors: result.errors,
        };
      });
    },
  });
};

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeGraphQL))),
      resolve: async (_parent, _args, { prisma }) => {
        return prisma.memberType.findMany();
      }
    },
    memberType: {
      type: MemberTypeGraphQL,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdType) }
      },
      resolve: async (_parent, { id }, { prisma }) => {
        return prisma.memberType.findUnique({
          where: { id }
        });
      }
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserGraphQL))),
      resolve: async (_parent, _args, { prisma }) => {
        return prisma.user.findMany();
      }
    },
    user: {
      type: UserGraphQL,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, { id }, { prisma }) => {
        return prisma.user.findUnique({
          where: { id }
        });
      }
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostGraphQL))),
      resolve: async (_parent, _args, { prisma }) => {
        return prisma.post.findMany();
      }
    },
    post: {
      type: PostGraphQL,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, { id }, { prisma }) => {
        return prisma.post.findUnique({
          where: { id }
        });
      }
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileGraphQL))),
      resolve: async (_parent, _args, { prisma }) => {
        return prisma.profile.findMany();
      }
    },
    profile: {
      type: ProfileGraphQL,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, { id }, { prisma }) => {
        return prisma.profile.findUnique({
          where: { id }
        });
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQueryType
});

export default plugin;
