export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code
      }),
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: 'INTERNAL_SERVER_ERROR'
      }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({
      error: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR'
    }),
    { status: 500 }
  );
};