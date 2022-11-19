const { BACKEND_URL, ENDPOINTS } = require("./config");

async function createUser({ email, fullName, userType, password, confirmPassword }) {
    const response = await fetch(new URL(ENDPOINTS.users.insert, BACKEND_URL), { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({email, fullName, userType, password, confirmPassword})
    });
    if (!response.ok) {
        const errDetails = await response.json();
        throw errDetails;
    }
}

async function verifyUser(uniqueString) {
    const response = await fetch(new URL(ENDPOINTS.users.verify.replace(":uniqueString", uniqueString), BACKEND_URL), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const message = await response.json();
        return message;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}

module.exports = {
    createUser,
    verifyUser,
};
