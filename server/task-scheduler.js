"use strict";
const sendEmail = require("./email/send-email");

class TaskScheduler {
    constructor() {
        this.unfinishedHikeNotifications = {};
    }
    
    addUnfinishedHikeNotification(user, hike, timeout) {
        if (this.unfinishedHikeNotifications[user._id] !== undefined) {
            throw new Error(`A notification is already planned for '${user._id}'.`);
        }
        this.unfinishedHikeNotifications[user._id] = setTimeout(async () => {
            await sendEmail({
				to: user.email,
				subject: `[${hike.title}] Unfinished Hike`,
				html: `<p>The hike <b>${hike.title}</b> has not been finished by you <b>${user.fullName}</b></p>`
			});
        }, timeout);
    }

    clearUnfinishedHikeNotification(userId) {
        if (this.unfinishedHikeNotifications[userId] !== undefined) {
            clearTimeout(this.unfinishedHikeNotifications[userId]);
            delete this.unfinishedHikeNotifications[userId];
        }
    }

    clearAll() {
        for (const key in this.unfinishedHikeNotifications) {
            this.clearUnfinishedHikeNotification(key);
        }
    }
}

module.exports = new TaskScheduler();