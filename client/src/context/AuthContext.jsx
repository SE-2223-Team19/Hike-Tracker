import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, logIn, logOut } from "../api/sessions";

const AuthContext = createContext({
	loggedIn: false,
	message: "",
	setMessage: () => {},
	handleLogin: () => {},
	handleLogout: () => {},
	user: null,
});

const AuthProvider = ({ children }) => {
	const navigate = useNavigate();

	const [loggedIn, setLoggedIn] = useState(false);
	const [message, setMessage] = useState("");
	const [user, setUser] = useState(null);

	useEffect(() => {
		const checkAuth = async () => {
			const user = await getUserInfo();
			if (user !== null) {
				setLoggedIn(true);
				setUser(user);
			}
		};
		checkAuth();
	}, []);

	const handleLogin = async (credentials) => {
		try {
			const user = await logIn(credentials);
			setUser(user);
			setLoggedIn(true);
			navigate("/");
			setMessage({ msg: `Welcome, ${user.fullName}!`, type: "success" });
		} catch (err) {
			setMessage({ msg: `Incorrect username or password`, type: "danger" });
		}
	};

	const handleLogout = async () => {
		await logOut();
		navigate("/");
		setLoggedIn(false);
		setUser(null);
		setMessage({ msg: `Logout successful!`, type: "secondary" });
	};

	return (
		<AuthContext.Provider
			value={{ handleLogin, handleLogout, loggedIn, message, setMessage, user }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
