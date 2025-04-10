import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export enum Permission {
	mng = "Manager",
	prime = "Prime",
	mod = "Moderator",
}

export async function isAdmin(
	userId: number,
	requiredPermission?: string,
): Promise<boolean> {
	const admin = await prisma.admin.findUnique({
		where: { userId: BigInt(userId) },
	});

	if (!admin) return false;
	if (!requiredPermission) return true;

	const permissionLevels = {
		[Permission.mng]: 3,
		[Permission.prime]: 2,
		[Permission.mod]: 1,
	};

	const userLevel = permissionLevels[admin.permission as Permission] || 0;
	const requiredLevel = permissionLevels[requiredPermission as Permission] || 0;

	return userLevel >= requiredLevel;
}

export async function getAllAdmins() {
	return prisma.admin.findMany();
}

export async function addOrUpdateAdmin(
	userId: number,
	username: string | null,
	permission: string,
) {
	const existingAdmin = await prisma.admin.findUnique({
		where: { userId: BigInt(userId) },
	});

	if (existingAdmin) {
		return prisma.admin.update({
			where: { userId: BigInt(userId) },
			data: { permission },
		});
	}

	return prisma.admin.create({
		data: {
			userId: BigInt(userId),
			username,
			permission,
		},
	});
}

export async function removeAdmin(userId: number) {
	return prisma.admin.delete({
		where: { userId: BigInt(userId) },
	});
}
