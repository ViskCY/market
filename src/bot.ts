import { Bot, InlineKeyboard } from "gramio";
import { config } from "config";
import { mainMenu, backMenu } from "./shared/keyboards/index";
import { getAllGroups, addGroup, findGroupById } from "db/groups";
import {
	initMessage,
	welcomeMessage,
	joinMessage,
} from "shared/messages/index";
import { isAdmin, Permission } from "db/admin";
import { generateInviteLink } from "services/invite";

export const bot = new Bot(config.BOT_TOKEN)
	.onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`))
	.command("start", (context) => {
		context.send(welcomeMessage, {
			reply_markup: mainMenu,
			parse_mode: "Markdown",
		});
	})
	.callbackQuery("marketplace", (context) => {
		context.editText("🛠️ This section is currently under construction!", {
			reply_markup: backMenu,
		});
	})
	.callbackQuery("join", async (context) => {
		const groups = await getAllGroups();
		const keyboard = new InlineKeyboard();
		for (const group of groups) {
			keyboard.text(`${group.name}`, `join_group_${group.groupId}`).row();
		}
		keyboard.text("♻️ Generate All", "generate_all_groups");
		keyboard.text("🔙 Main Menu", "main_menu");
		context.editText(joinMessage, {
			parse_mode: "Markdown",
			reply_markup: keyboard,
		});
	})
	.callbackQuery("generate_all_groups", async (context) => {
		try {
			const groups = await getAllGroups();
			let message = "🎯 *Generated Links:*\n\n";

			for (const group of groups) {
				const result = await generateInviteLink(
					bot,
					Number(group.groupId),
					group.name,
				);

				if (result.error || !result.link) {
					message += `⚠️ Failed to generate link for ${group.name}\n`;
				} else {
					message += `${group.name}: ${result.link}\n`;
				}
			}

			context.editText(message, {
				parse_mode: "Markdown",
				reply_markup: backMenu,
				link_preview_options: {
					is_disabled: true,
				},
			});
		} catch (error) {
			console.error("Error generating invite links:", error);
			context.send("⚠️ An error occurred while generating links.");
		}
	})
	.callbackQuery(/join_group_(-\d+)/, async (context) => {
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
				return context.send("⚠️ Failed to generate invite link");
			}

			context.editText(
				`🎯 *Link ready for ${group.name}:*\n\n ${result.link}\n\n`,
				{
					parse_mode: "Markdown",
					link_preview_options: {
						is_disabled: true,
					},
					reply_markup: backMenu,
				},
			);
		} catch (error) {
			console.error("Error generating invite link:", error);
		}
	})
	.callbackQuery("register", async (context) => {
		context.editText("💎 Pre-Registering will start from 12. April 2025 ‼️", {
			reply_markup: backMenu,
		});
	})
	.callbackQuery("main_menu", (context) => {
		context.editText(welcomeMessage, {
			reply_markup: mainMenu,
			parse_mode: "Markdown",
		});
	})
	.command("init_group", async (context) => {
		if (context.chat.type !== "group" && context.chat.type !== "supergroup")
			return;
		if (!context.from || !(await isAdmin(context.from.id, Permission.mng)))
			return;

		const groupId = context.chat.id;
		const groupName = context.chat.title || "Unknown Group";
		const existingGroup = await findGroupById(groupId);

		if (existingGroup) {
			return context.send(
				`⚠️ This group is already registered as "${existingGroup.name}".`,
			);
		}

		await addGroup(groupId, groupName);

		context.send(`⚠️ Initialising group ${groupName}, setting up enviorment...`);
		return context.send(initMessage);
	});
