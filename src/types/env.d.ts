declare namespace NodeJS {
  interface ProcessEnv {
    ENABLE_ANALYTICS?: string;
    NEXT_PUBLIC_ANALYTICS_ID?: string;
    MOCK_PROGRESS?: string;
    OPENAI_API_KEY?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

