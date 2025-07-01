import React from "react";
import { useState } from "react";
import styles from "../styles/Main.module.css";
import { useNavigate } from "react-router-dom";

const FIELDS = {
	NAME: "name",
	ROOM: "room",
}

const Main = () => {
	const { NAME, ROOM } = FIELDS;
	const [values, setValues] = useState({ [NAME]: "", [ROOM]: "" });
	const navigate = useNavigate();

	const handleChange = ({ target: { value, name } }) => {
		setValues({ ...values, [name]: value });
	}

	const handleSubmit = (e) => {
		e.preventDefault(); // зупиняємо стандартне оновлення сторінки
		const query = `?name=${values[NAME]}&room=${values[ROOM]}`;
		navigate(`/chat${query}`);
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles["my-container"]}>
				<h1 className={styles.heading}>Join</h1>
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.group}>
						<input
							type="text"
							name="name"
							value={values[NAME]}
							placeholder="Your name"
							className={styles.input}
							onChange={handleChange}
							autoComplete="off"
							required
						/>
					</div>
					<div className={styles.group}>
						<input
							type="text"
							name="room"
							value={values[ROOM]}
							placeholder="Room"
							className={styles.input}
							onChange={handleChange}
							autoComplete="off"
							required
						/>
					</div>
					<button type="submit" className={styles.button}>
						Sign in
					</button>
				</form>
			</div>
		</div>
	);
};

export default Main;
