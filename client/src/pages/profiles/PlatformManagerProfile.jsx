import { React, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { getUsers } from "../../api/users.js";
import Loading from "../../components/Loading.jsx";
import NoData from "../../components/NoData";
import PaginatedList from "../../components/pagination/PaginatedList.jsx";
import UserFilters from "../../components/User/UserFilters.jsx";
import UserRow from "../../components/User/UserCard.jsx";
import { CgOptions } from "react-icons/cg";

const PlatformManagerProfile = () => {

    const [openFilters, setOpenFilters] = useState(false);
    const [filters, setFilters] = useState({});
    const [dirty, setDirty] = useState(false);

	return (
		<>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h1 className="#tests-title">Users</h1>
				<Button
					className="#tests-filter-button"
					variant={openFilters ? "success" : "outline-success"}
					style={{ borderRadius: 20 }}
					onClick={() => {
						setOpenFilters(!openFilters);
						if (openFilters) {
							setFilters({}); // Clear filters
						}
					}}
				>
					<CgOptions style={{ marginRight: ".4rem" }} />
					Filters
				</Button>
			</Stack>
            {openFilters && (
				<UserFilters
					filters={filters}
					setFilters={setFilters}
				/>
			)}
            <PaginatedList
                dataElement={(user) => <UserRow key={user._id} user={user} setDirty={setDirty} />}
                errorElement={(error) => <NoData message={error.message} />}
                noDataElement={() => <NoData message={"There are no users"} />}
                loadingElement={() => <Loading />}
                fetchCall={getUsers}
                filters={filters}
                dirty={dirty}
                setDirty={setDirty}
            />
		</>
	);
};

export default PlatformManagerProfile;