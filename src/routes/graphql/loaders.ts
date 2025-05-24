import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export function createLoaders(prisma: PrismaClient) {
  const userLoader = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: [...userIds]
        }
      }
    });
    return userIds.map(id => users.find(user => user.id === id) || null);
  });

  const userSubscribedToLoader = new DataLoader(async (userIds: readonly string[]) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: {
        subscriberId: {
          in: [...userIds]
        }
      },
      include: {
        author: true
      }
    });

    return userIds.map(userId => 
      subscriptions
        .filter(sub => sub.subscriberId === userId)
        .map(sub => sub.author)
    );
  });

  const subscribedToUserLoader = new DataLoader(async (userIds: readonly string[]) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: {
        authorId: {
          in: [...userIds]
        }
      },
      include: {
        subscriber: true
      }
    });

    return userIds.map(userId => 
      subscriptions
        .filter(sub => sub.authorId === userId)
        .map(sub => sub.subscriber)
    );
  });

  const profileLoader = new DataLoader(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          in: [...userIds]
        }
      }
    });
    return userIds.map(id => profiles.find(profile => profile.userId === id) || null);
  });

  const postsLoader = new DataLoader(async (userIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: [...userIds]
        }
      }
    });
    return userIds.map(userId => 
      posts.filter(post => post.authorId === userId)
    );
  });

  const memberTypeLoader = new DataLoader(async (memberTypeIds: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: {
          in: [...memberTypeIds]
        }
      }
    });
    return memberTypeIds.map(id => memberTypes.find(mt => mt.id === id) || null);
  });

  return {
    userLoader,
    userSubscribedToLoader,
    subscribedToUserLoader,
    profileLoader,
    postsLoader,
    memberTypeLoader
  };
} 