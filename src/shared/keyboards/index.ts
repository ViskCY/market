import { Keyboard, InlineKeyboard } from "gramio";

export const mainMenu = new InlineKeyboard()
	.text("🔒 Marketplace (Loged Out)", "marketplace")
	.row()
	.text("🎯 Join Groups", "join_groups")
	.row()
	.text("🆘 Support", "support")
	.text("📝 Pre-Register", "join_groups");

export const marketplaceMenu = new InlineKeyboard().text(
	"Back to Main Menu",
	"main_menu",
);

export const supportMenu = new InlineKeyboard()
	.text("FAQ", "faq")
	.row()
	.text("Contact Us", "contact")
	.row()
	.text("Back to Main Menu", "main_menu");

export const joinGroupsMenu = new InlineKeyboard()
	.text("Group 1", "group1")
	.row()
	.text("Group 2", "group2")
	.row()
	.text("Back to Main Menu", "main_menu");
