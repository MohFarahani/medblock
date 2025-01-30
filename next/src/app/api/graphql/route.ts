import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { sequelize } from '@/db/connection';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
});

export async function POST(req: NextRequest) {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const handler = startServerAndCreateNextHandler(server, {
      context: async () => ({ sequelize }),
    });

    return handler(req);
  } catch (error) {
    console.error('GraphQL API Error:', error);
    return new Response(
      JSON.stringify({
        errors: [{
          message: error instanceof Error ? error.message : 'Internal Server Error',
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            error: error instanceof Error ? error.stack : undefined
          }
        }]
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}