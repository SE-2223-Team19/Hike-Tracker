const { BACKEND_URL, ENDPOINTS } = require("./config");

async function getUserInfo() {
    const response = await fetch(new URL(ENDPOINTS.sessions.current, BACKEND_URL), {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else if (response.status === 401) {
        return null;
    } else {
        throw user;
    }
}

async function logIn(credentials) {
    const response = await fetch(new URL(ENDPOINTS.sessions.insert, BACKEND_URL), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
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

async function logOut() {
    const response = await fetch(new URL(ENDPOINTS.sessions.current, BACKEND_URL), {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}
export { getUserInfo, logIn, logOut }