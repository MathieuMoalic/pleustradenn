import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

export async function runStartupTasks() {
    const username = process.env.FIRST_USER_USERNAME;
    const password = process.env.FIRST_USER_PASSWORD;
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl || !username || !password) {
        console.warn('Skipping default user creation due to missing env vars');
        return;
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
        return;
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            username,
            password_hash: hash
        }
    });

    console.log(`🌱 Default user "${username}" created`);
}
