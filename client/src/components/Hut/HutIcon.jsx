import { Stack } from "react-bootstrap";

const HutIcon = ({ icon, text }) => {
	return (
		<Stack direction="horizontal" gap={4}>
			<div className="d-flex flex-row">
				{icon}
				<span className="ms-2">{text}</span>
			</div>
		</Stack>
	);
};

export default HutIcon;
