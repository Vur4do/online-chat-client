import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import styles from "../styles/Chat.module.css";
import icon from "../images/emoji.svg";
import EmojiPicker from "emoji-picker-react";
import Messages from "./Messages";

const socket = io.connect("http://localhost:5000");

const Chat = () => {
	const { search } = useLocation();
	const navigate = useNavigate();
	const [params, setParams] = useState({ user: "", room: "" });
	const [state, setState] = useState([]);
	const [message, setMessage] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [users, setUsers] = useState(0);

	useEffect(() => {
		const searchParams = Object.fromEntries(new URLSearchParams(search));
		setParams(searchParams);
		socket.emit('join', searchParams);
	}, [search])

	useEffect(() => {
		socket.on('message', ({ data }) => {
			setState((_state) => [..._state, data]);
		});
	}, []);

	useEffect(() => {
		socket.on('room', ({ data: { users } }) => {
			setUsers(users.length);
		});
	}, []);

	const leaveRoom = () => {
		socket.emit("leaveRoom", { params });
		navigate("/");
	};
	const handleChange = ({ target: { value } }) => { setMessage(value) };
	const onEmojiClick = (emojiData) => {
		setMessage(prev => `${prev} ${emojiData.emoji}`);
	};
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!message) return;

		socket.emit("sendMessage", { message, params });

		setMessage("");
	};

	return (
		<div className={styles.wrapper} >
			<div className={styles.header}>
				<div className={styles.title}>
					{params.room}
				</div>
				<div className={styles.users}>
					{users} users are in this room
				</div>
				<button className={`${styles.button} ${styles.leave}`} onClick={leaveRoom}>
					Leave the room
				</button>
			</div>
			<div className={styles.messages}>
				<Messages messages={state} name={params.name} />
			</div>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.input}>
					<input
						type="text"
						name="message"
						value={message}
						placeholder="Write here"
						onChange={handleChange}
						autoComplete="off"
						required
					/>
				</div>
				<div className={styles.emoji}>
					<img src={icon} alt="love emoji" onClick={() => setIsOpen(prev => !prev)} />
					{isOpen && (
						<div className={styles.emojies}>
							<EmojiPicker onEmojiClick={onEmojiClick} />
						</div>
					)}
				</div>
				<button className={`${styles.button} ${styles.send}`} type="submit" onSubmit={handleSubmit}>Send</button>
			</form>
		</div >
	)
};

export default Chat;
