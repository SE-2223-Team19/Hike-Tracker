const { BACKEND_URL, ENDPOINTS } = require("./config");

async function createUser(user) {
    const response = await fetch(new URL(ENDPOINTS.user.insert, BACKEND_URL), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}

async function updateUser(user) {
    const response = await fetch(new URL(ENDPOINTS.user.update, BACKEND_URL), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}

module.exports = {
    createUser,
    updateUser,
};