import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLFloat, GraphQLInt, GraphQLBoolean, GraphQLList } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberTypeIdType } from './types/member-type-id.js';

// MemberType definition
export const MemberTypeGraphQL = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdType) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) }
  })
});

// Post definition
export const PostGraphQL = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) }
  })
});

// Profile definition
export const ProfileGraphQL = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdType) },
    memberType: {
      type: new GraphQLNonNull(MemberTypeGraphQL),
      resolve: async (parent, _args, { prisma }) => {
        const memberType = await prisma.memberType.findUnique({
          where: { id: parent.memberTypeId }
        });
        if (!memberType) {
          throw new Error(`MemberType not found for id: ${parent.memberTypeId}`);
        }
        return memberType;
      }
    }
  })
});

// User definition
export const UserGraphQL = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileGraphQL,
      resolve: async (parent, _args, { prisma }) => {
        return prisma.profile.findUnique({
          where: { userId: parent.id }
        });
      }
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostGraphQL))),
      resolve: async (parent, _args, { prisma }) => {
        return prisma.post.findMany({
          where: { authorId: parent.id }
        });
      }
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserGraphQL))),
      resolve: async (parent, _args, { prisma }) => {
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: parent.id },
          include: { author: true }
        });
        return subscriptions.map(sub => sub.author);
      }
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserGraphQL))),
      resolve: async (parent, _args, { prisma }) => {
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: parent.id },
          include: { subscriber: true }
        });
        return subscriptions.map(sub => sub.subscriber);
      }
    }
  })
}); 