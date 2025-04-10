import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function getAllGroups() {
	return prisma.group.findMany();
}

export async function addGroup(groupId: number, name: string) {
	return prisma.group.create({
		data: {
			groupId: BigInt(groupId),
			name,
		},
	});
}

export async function findGroupById(groupId: number) {
	return prisma.group.findFirst({
		where: {
			groupId: BigInt(groupId),
		},
	});
}
