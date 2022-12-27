"use strict";

class Transport {
    /**
     * 
     * @param {NodeMailer} ref 
     * @param {*} options 
     */
    constructor(ref, options) {
        this.options = options;
        this.ref = ref;
    }

    sendMail(mailOptions) {
        if (Array.isArray(mailOptions.to)) {
            return Promise.all(mailOptions.to.map(recipient => this.sendMail({ ...mailOptions, to: recipient })));
        }

        if (!(mailOptions.to in this.ref.inboxes)) {
            this.ref.inboxes[mailOptions.to] = [];
        }

        this.ref.inboxes[mailOptions.to].push(mailOptions);
        return new Promise((resolve, reject) => resolve());
    }
}

class NodeMailer {

    constructor() {
        this.inboxes = {};
    }

    createTransport(options) {
        return new Transport(this, options);
    }

    getInboxFor(email) {
        return this.inboxes[email];
    }

    clearInboxFor(email) {
        delete this.inboxes[email];
    }

    clearAllInboxes() {
        this.inboxes = {};
    }
}

module.exports = new NodeMailer();