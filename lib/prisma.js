import { PrismaClient } from "./generated/prisma";

export const db = new PrismaClient();

if(process.env.NODE_ENV !=="production"){
    globalThis.prisma = db;
}

