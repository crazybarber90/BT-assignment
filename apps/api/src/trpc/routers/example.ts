import { publicProcedure, createTRPCRouter } from "../init";

let counter = 0;

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return {
      message: "Hello from TRPC!",
      timestamp: new Date().toISOString(),
    };
  }),

  incrementCounter: publicProcedure
    .mutation(() => {
      counter++;
      console.log(`Counter incremented, new value: ${counter}`);
      return {
        newValue: counter,
      };
    }),
});