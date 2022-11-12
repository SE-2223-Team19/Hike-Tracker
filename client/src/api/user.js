const BACKEND_URL = "http://localhost:8080/api";

async function getUserInfo() {
    const url = BACKEND_URL + '/session/current';
    const response = await fetch(url, {
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
    const url = BACKEND_URL + '/session';
    const response = await fetch(url, {
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
    const url = BACKEND_URL + '/session/current'
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}
export { getUserInfo, logIn, logOut }