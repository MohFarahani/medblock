import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { sequelize } from '@/db/connection';
import { handleApiError } from '@/utils/errorHandling';
import { LogService } from '@/utils/logging';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    LogService.error('GraphQL Error', error);
    return error;
  },
});

export async function POST(req: NextRequest) {
  try {
    await sequelize.authenticate();
    LogService.info('Database connection established successfully');

    const handler = startServerAndCreateNextHandler(server, {
      context: async () => ({ sequelize }),
    });

    return handler(req);
  } catch (error) {
    LogService.error('GraphQL route error', error);
    return handleApiError(error);
  }
}