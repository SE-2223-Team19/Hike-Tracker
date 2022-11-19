const { BACKEND_URL, ENDPOINTS } = require("./config");

async function signIn({ email, fullName, userType, password, confirmPassword }) {
    const response = await fetch(new URL(ENDPOINTS.users.insert, BACKEND_URL), { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({email, fullName, userType, password, confirmPassword})
    });
    if (!response.ok) {
        const resBody = await response.json();
        throw resBody;
    }
}

export { signIn }