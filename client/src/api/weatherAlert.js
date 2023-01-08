
const { ENDPOINTS, BACKEND_URL } = require("./config");


async function getWeatherAlertById(id) {
	try {
		const response = await fetch(new URL(ENDPOINTS.weatherAlert.byId.replace(":id", id), BACKEND_URL), {
			credentials: "include",
		});
		if (response.ok) return await response.json();
		throw await response.json();
	} catch (err) {
		console.error(err);
	}
}


async function updateWeatherAlert(Mapchanges) {
	
	try {
		const response = await fetch(
			new URL(ENDPOINTS.weatherAlert.update, BACKEND_URL),
			{
				method: "PATCH",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(Mapchanges),
			}
		);
		return await response.json();
	} catch (err) {
		console.error(err);
	}
}

module.exports={
    updateWeatherAlert,
	getWeatherAlertById
}