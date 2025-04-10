import { Keyboard, InlineKeyboard } from "gramio";

export const mainMenu = new InlineKeyboard()
	.text("🔒 Marketplace (Loged Out)", "marketplace")
	.row()
	.text("🎯 Join Groups", "join")
	.row()
	.url("🆘 Support", "t.me/notvipdizzy")
	.text("📝 Pre-Register", "register");

export const backMenu = new InlineKeyboard().text("🔙 Main Menu", "main_menu");
