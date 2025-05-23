import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLBoolean } from 'graphql';
import { MemberTypeGraphQL, PostGraphQL, ProfileGraphQL, UserGraphQL } from './types.js';
import { UUIDType } from './types/uuid.js';
import { MemberTypeIdType } from './types/member-type-id.js';
import { 
  CreateUserInput, 
  ChangeUserInput, 
  CreatePostInput, 
  ChangePostInput, 
  CreateProfileInput, 
  ChangeProfileInput 
} from './types/inputs.js';

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

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserGraphQL),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) }
      },
      resolve: async (_parent, { dto }, { prisma }) => {
        return prisma.user.create({
          data: dto
        });
      }
    },
    changeUser: {
      type: new GraphQLNonNull(UserGraphQL),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) }
      },
      resolve: async (_parent, { id, dto }, { prisma }) => {
        return prisma.user.update({
          where: { id },
          data: dto
        });
      }
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, { id }, { prisma }) => {
        await prisma.user.delete({
          where: { id }
        });
        return true;
      }
    },
    createPost: {
      type: new GraphQLNonNull(PostGraphQL),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) }
      },
      resolve: async (_parent, { dto }, { prisma }) => {
        return prisma.post.create({
          data: dto
        });
      }
    },
    changePost: {
      type: new GraphQLNonNull(PostGraphQL),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) }
      },
      resolve: async (_parent, { id, dto }, { prisma }) => {
        return prisma.post.update({
          where: { id },
          data: dto
        });
      }
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, { id }, { prisma }) => {
        await prisma.post.delete({
          where: { id }
        });
        return true;
      }
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileGraphQL),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) }
      },
      resolve: async (_parent, { dto }, { prisma }) => {
        return prisma.profile.create({
          data: dto
        });
      }
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileGraphQL),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) }
      },
      resolve: async (_parent, { id, dto }, { prisma }) => {
        return prisma.profile.update({
          where: { id },
          data: dto
        });
      }
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, { id }, { prisma }) => {
        await prisma.profile.delete({
          where: { id }
        });
        return true;
      }
    },
    subscribeTo: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, { userId, authorId }, { prisma }) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId
          }
        });
        return true;
      }
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) }
      },
      resolve: async (_parent, { userId, authorId }, { prisma }) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId
            }
          }
        });
        return true;
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

export default plugin;
