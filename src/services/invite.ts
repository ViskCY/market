import type { Bot } from "gramio";

export async function generateInviteLink(
	bot: Bot,
	groupId: number,
	name: string,
) {
	try {
		const link = await bot.api.createChatInviteLink({
			chat_id: groupId,
			member_limit: 1,
			expire_date: Math.floor(Date.now() / 1000) + 600, // 10 minutes expiration
		});
		return { id: groupId, name, link: link.invite_link, error: null };
	} catch (error) {
		console.error(
			`Failed to generate invite link for group ${groupId}:`,
			error,
		);
		return { id: groupId, name, link: null, error };
	}
}
