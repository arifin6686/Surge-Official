'use strict';

const messages = [
	"ventured into Shrek's Swamp.",
	"disrespected the OgreLord!",
	"used Explosion!",
	"was swallowed up by the Earth!",
	"was eaten by Lex!",
	"was sucker punched by Absol!",
	"has left the building.",
	"got lost in the woods!",
	"left for their lover!",
	"was hit by Magikarp's Revenge!",
	"was sucked into a whirlpool!",
	"got scared and left the server!",
	"went into a cave without a repel!",
	"got eaten by a bunch of piranhas!",
	"ventured too deep into the forest without an escape rope",
	"got shrekt",
	"woke up an angry Snorlax!",
	"was forced to give jd an oil massage!",
	"was used as shark bait!",
	"peered through the hole on Shedinja's back",
	"received judgment from the almighty Arceus!",
	"used Final Gambit and missed!",
	"went into grass without any Pokemon!",
	"made a Slowbro angry!",
	"took a focus punch from Breloom!",
	"got lost in the illusion of reality.",
	"ate a bomb!",
	"left for a timeout!",
	"fell into a snake pit!",
	"felt snorlax's warth!",
];

exports.commands = {
	poofoff: 'poff',
	poff: function (target, room, user) {
		if (!this.can('gamemanagement', null, room)) return;
		if (room.poofDisabled) {
			return this.errorReply("Poof is already disabled in this room.");
		}
		room.poofDisabled = true;
		if (room.chatRoomData) {
			room.chatRoomData.poofDisabled = true;
			Rooms.global.writeChatRoomData();
		}
		return this.sendReply("Poof has been disabled for this room.");
	},

	poofon: 'pon',
	pon: function (target, room, user) {
		if (!this.can('gamemanagement', null, room)) return;
		if (!room.poofDisabled) {
			return this.errorReply("Poof is already enabled in this room.");
		}
		delete room.poofDisabled;
		if (room.chatRoomData) {
			delete room.chatRoomData.poofDisabled;
			Rooms.global.writeChatRoomData();
		}
		return this.sendReply("Poof has been enabled for this room.");
	},

	cpoof: 'poof',
	poof: function (target, room, user) {
		if (room.poofDisabled) return this.errorReply("Poof is currently disabled for this room.");
		if (target && !this.can('broadcast')) return false;
		let message = target || messages[Math.floor(Math.random() * messages.length)];
		if (message.indexOf('{{user}}') < 0) message = '{{user}} ' + message;
		message = message.replace(/{{user}}/g, user.name);
		if (!this.canTalk(message)) return false;

		let color = '#' + [1, 1, 1].map(function () {
			let part = Math.floor(Math.random() * 0xaa);
			return (part < 0x10 ? '0' : '') + part.toString(16);
		}).join('');

		room.addRaw('<center><strong><font color="' + color + '">~~ ' + Chat.escapeHTML(message) + ' ~~</font></strong></center>');
		user.lastPoof = Date.now();
		user.lastPoofMessage = message;
		user.disconnectAll();
	},

	poofhelp: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			'<center><b>Poof Commands</b></center>' +
			'<hr width="80%">' +
			'/poof - leave the server with random message. Requires + or higher.<br>' +
			'/cpoof [message] - Leave server with custom message.<br>' +
			'/poofon - Enable poof in a chat room. Requires # or higher.<br>' +
			'/poofoff - Disable poof in a chat room. Requires # or higher.'
		);
	},
};
