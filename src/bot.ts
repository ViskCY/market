import { Bot, InlineKeyboard } from "gramio";
import { config } from "./config.ts";
import {
	mainMenu,
	marketplaceMenu,
	supportMenu,
	joinGroupsMenu,
} from "./shared/keyboards/index.ts";
import { getAllGroups } from "./db/groups.ts";

export const bot = new Bot(config.BOT_TOKEN)
	.command("start", (context) => {
		context.send("Welcome to the Main Menu!", { reply_markup: mainMenu });
	})
	.callbackQuery("marketplace", (context) => {
		context.editText("This section is currently under construction! 🛠️", {
			reply_markup: marketplaceMenu,
		});
	})
	.callbackQuery("support", (context) => {
		context.editText("Support Menu", { reply_markup: supportMenu });
	})
	.callbackQuery("join_groups", async (context) => {
		const groups = await getAllGroups();
		const keyboard = new InlineKeyboard();
		keyboard.text("All Groups", "join_all_groups").row();

		for (const group of groups) {
			keyboard.text(`${group.name}`, `join_group_${group.groupId}`).row();
		}

		context.editText("Join Groups Menu", { reply_markup: joinGroupsMenu });
	})
	.callbackQuery("main_menu", (context) => {
		context.editText("Welcome back to the Main Menu!", {
			reply_markup: mainMenu,
		});
	})
	.onStart(({ info }) => console.log(`✨ Bot ${info.username} was started!`));
