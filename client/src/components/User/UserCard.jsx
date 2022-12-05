import { React, useState, forwardRef } from "react";
import { Card, Form, Stack, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { updateUser } from "../../api/users";
import { capitalizeAndReplaceUnderscores, userTypeToColour } from "../../helper/utils";
import { CgCheckO } from "react-icons/cg";

const EmailVerifiedIcon = forwardRef((props, ref) => {
    return (
        <span ref={ref}>
            <CgCheckO {...props} />
        </span>
    );
});

function UserRow({user, setDirty}) {

    const [updating, setUpdating] = useState(false);

    return (
        <Card className="flex-row p-3 mt-4">
			<Card.Body>
				<Card.Title>
                    <Stack direction="horizontal" className="justify-content-between align-items-center">
						<h5>{user.fullName}</h5>
						<Badge bg={userTypeToColour(user.userType)}>
							{capitalizeAndReplaceUnderscores(user.userType)}
						</Badge>
					</Stack>
                </Card.Title>
                <Stack direction="horizontal">
                    <div className="d-flex flex-row">
                        {
                            user.isEmailValidated &&
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip>
                                        The email is verified
                                    </Tooltip>
                                }
                            >
                                <EmailVerifiedIcon style={{"color": "rgba(var(--bs-success-rgb)"}} />
                            </OverlayTrigger>
                        }
                        <span className="ms-1">{user.email}</span>
                    </div>
                    <div className="d-flex flex-row ms-auto">
                        <span className="ms-1">
                            <Form.Switch 
                                disabled={updating}
                                checked={user.isValid}
                                label={"Valid user"}
                                onChange={() => {
                                    setUpdating(true);
                                    updateUser(user._id, {
                                        isValid: !user.isValid
                                    })
                                    .then(() => {
                                        setUpdating(false);
                                        setDirty(true);
                                    });
                                }}
                            />
                        </span>
                    </div>
                </Stack>
            </Card.Body>
        </Card>
    );
}

export default UserRow;