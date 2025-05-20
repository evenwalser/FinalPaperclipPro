declare module 'together-js' {
  export default class Together {
    constructor(apiKey: string);
    inference: {
      invoke: (
        model: string,
        params: {
          prompt: string;
          max_tokens?: number;
          temperature?: number;
          response_format?: { type: string };
        }
      ) => Promise<{
        output: {
          text: string;
        };
      }>;
    };
  }
} 