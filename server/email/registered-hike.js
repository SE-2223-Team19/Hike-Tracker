const sendEmail = require("./send-email");
const userDAL = require("../data/user-dal");

async function sendRegisteredHikeTerminatedEmail(registeredHike) {
    const buddieEmails = await Promise.all(
        registeredHike.buddyUsers
        .map(buddy => userDAL.getUserById(buddy)
                        .then(b => b.email)
        )
    );
    if (buddieEmails.length > 0) {
        sendEmail({
            to: buddieEmails,
            subject: `[${registeredHike.hike.title}] Registered hike terminated`,
            html: `<p>The hike <b>${registeredHike.hike.title}<b> you were following was terminated by the user <b>${registeredHike.user.fullName}</b> at <b>${registeredHike.endTime.toString()}</b></p>`
        });
    }
}

module.exports = {
    sendRegisteredHikeTerminatedEmail,
};