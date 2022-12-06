const { BACKEND_URL, ENDPOINTS } = require("./config");

async function createUser({ email, fullName, userType, password, confirmPassword }) {
    const response = await fetch(new URL(ENDPOINTS.users.insert, BACKEND_URL), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ email, fullName, userType, password, confirmPassword })
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
    if (response.ok || response.status === 404) {
        const message = await response.json();
        return message;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}

async function getPreferences() {
    const response = await fetch(new URL(ENDPOINTS.users.preferences, BACKEND_URL), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
    });
    if (response.ok) {
        const preferences = await response.json();
        return preferences;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}

async function updatePreferences(preferences) {
    const response = await fetch(new URL(ENDPOINTS.users.preferences, BACKEND_URL), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(preferences)
    });
    if (response.ok) {
        const preferences = await response.json();
        return preferences;
    }
    else {
        const errDetails = await response.json();
        throw errDetails;
    }
}

async function deletePreferences() {
    const response = await fetch(new URL(ENDPOINTS.users.preferences, BACKEND_URL), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
    });
    if (response.ok) {
        const preferences = await response.json();
        return preferences;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}


module.exports = {
    createUser,
    verifyUser,
    getPreferences,
    updatePreferences,
    deletePreferences
};
