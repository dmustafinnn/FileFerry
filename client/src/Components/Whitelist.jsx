import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import {Container} from "@mui/material";
import axios_instance from "../config";

const columns = [
	{ field: "name", headerName: "Name", width: 130 },
	{ field: "email", headerName: "Email", width: 400 },
];


const Whitelist = () => {

    const [whitelistUsers, setWhiteListUsers] = React.useState([]);

    React.useEffect(() => {
		axios_instance.get("/users/whitelist").then((response) => {
			const data = response.data;
			if(data.whitelist)
				setWhiteListUsers(data.whitelist);
		});
	}, []);

	return (
		<Box>
			<Container sx={{ py: 10 }}>
				<div style={{ height: 400, width: "100%" }}>
					<DataGrid
						rows={whitelistUsers}
						getRowId={(row) => {return row._id;}}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: 5 },
							},
						}}
						pageSizeOptions={[5, 10]}
						checkboxSelection
					/>
				</div>
			</Container>
		</Box>
	);
};

export default Whitelist;
