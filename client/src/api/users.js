const { BACKEND_URL, ENDPOINTS } = require("./config");
const { addQueryParams } = require("./config");

async function getUsers(filters = {}) {
	try {
		const url = new URL(ENDPOINTS.users.all, BACKEND_URL);

		addQueryParams(url, filters);

		const response = await fetch(url, {
			credentials: "include",
		});
		if (response.ok) return await response.json();
		throw await response.json();
	} catch (err) {
		return { error: err };
	}
}

async function createUser({ email, fullName, userType, password, confirmPassword, hutsSelected, phone, website }) {
	const response = await fetch(new URL(ENDPOINTS.users.insert, BACKEND_URL), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ email, fullName, userType, password, confirmPassword, hutsSelected, phone, website }),
	});
	if (!response.ok) {
		const errDetails = await response.json();
		throw errDetails;
	}
}

async function verifyUser(uniqueString) {
	const response = await fetch(
		new URL(ENDPOINTS.users.verify.replace(":uniqueString", uniqueString), BACKEND_URL),
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	if (response.ok || response.status === 404) {
		const message = await response.json();
		return message;
	} else {
		const errDetails = await response.text();
		throw errDetails;
	}
}

async function updateUser(id, changes) {
	try {
		const response = await fetch(new URL(ENDPOINTS.users.update.replace(":id", id), BACKEND_URL), {
			method: "PATCH",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(changes),
		});
		if (!response.ok) throw await response.json();
	} catch (err) {
		console.error(err);
	}
}

async function getPreferences() {
	const response = await fetch(new URL(ENDPOINTS.users.preferences, BACKEND_URL), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	if (response.ok) {
		const preferences = await response.json();
		return preferences;
	} else {
		const errDetails = await response.text();
		throw errDetails;
	}
}

async function updatePreferences(preferences) {
	const response = await fetch(new URL(ENDPOINTS.users.preferences, BACKEND_URL), {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(preferences),
	});
	if (response.ok) {
		const preferences = await response.json();
		return preferences;
	} else {
		const errDetails = await response.json();
		throw errDetails;
	}
}

async function deletePreferences() {
	const response = await fetch(new URL(ENDPOINTS.users.preferences, BACKEND_URL), {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	if (response.ok) {
		const preferences = await response.json();
		return preferences;
	} else {
		const errDetails = await response.text();
		throw errDetails;
	}
}

module.exports = {
	getUsers,
	createUser,
	verifyUser,
	updateUser,
	getPreferences,
	updatePreferences,
	deletePreferences,
};
