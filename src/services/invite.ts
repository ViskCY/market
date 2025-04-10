import type { Bot } from "gramio";
import { bot } from "bot";
import { findGroupById } from "db/groups";

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

bot.callbackQuery(/join_group_(-\d+)/, async (context) => {
	const callbackData = context.queryPayload;
	const groupId = Number.parseInt(
		typeof callbackData === "string"
			? callbackData.split("_").pop() || "0"
			: "0",
	);

	try {
		const group = await findGroupById(groupId);
		if (!group) return;

		const result = await generateInviteLink(
			bot,
			Number(group.groupId),
			group.name,
		);

		if (result.error || !result.link) {
			return context.send(
				"⚠️ Failed to generate invite link. Please try again later.",
			);
		}

		context.send(`🎯 *Link ready for ${group.name}:*\n\n ${result.link}\n\n`, {
			parse_mode: "Markdown",
			link_preview_options: {
				is_disabled: true,
			},
		});
	} catch (error) {
		console.error("Error generating invite link:", error);
	}
});
