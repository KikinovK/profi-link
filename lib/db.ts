import { PrismaClient } from "@prisma/client";
import { isProduction } from "./config";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (!isProduction) globalThis.prisma = db;
