import { initTRPC } from "@trpc/server";
import type { Context } from "hono";
import superjson from "superjson";

type TRPCContext = {};

export const createTRPCContext = async (
  _: unknown,
  c: Context
): Promise<TRPCContext> => {
  return {};
};

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;
