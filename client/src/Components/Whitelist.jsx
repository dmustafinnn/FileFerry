import * as React from "react";
import Box from "@mui/material/Box";
import {
	Button,
	Container, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow, TextField,
} from "@mui/material";
import axios_instance from "../config";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useState } from "react";

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{
		id: 'name',
		numeric: false,
		disablePadding: true,
		label: 'Name',
	},
	{
		id: 'email',
		numeric: false,
		disablePadding: true,
		label: 'Email',
	}
];
const Whitelist = () => {

	return (
		<Box>
			<Container sx={{ py: 10 }}>

				<WhiteListTable />
			</Container>
		</Box>
	);
};

const WhiteListTableHead = (props) => {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
		props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all desserts',
						}}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

WhiteListTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

const WhiteListTableToolbar = (props) => {
	const { numSelected, handleDelete } = props;

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) =>
						alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
				}),
			}}
		>
			{numSelected > 0 ? (
				<Typography
					sx={{ flex: '1 1 100%' }}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			) : (
				<Typography
					sx={{ flex: '1 1 100%' }}
					variant="h6"
					id="tableTitle"
					component="div"
				>
					Whitelisted Users
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton onClick={handleDelete}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Filter list">
					<IconButton>
						<FilterListIcon />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
}

WhiteListTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

const WhiteListTable = (props) => {
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('calories');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [whitelistUsers, setWhiteListUsers] = React.useState([]);
	const [addEmail, setAddEmail] = useState('');
	const [showAddDialog, setShowAddDialog] = useState(false);

	React.useEffect(() => {
		axios_instance.get("/users/whitelist").then((response) => {
			const data = response.data;
			if (data.whitelist)
				setWhiteListUsers(data.whitelist);
		});
	}, []);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = whitelistUsers.map((n) => n._id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (id) => selected.indexOf(id) !== -1;

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - whitelistUsers.length) : 0;

	const visibleRows = React.useMemo(
		() =>
			stableSort(whitelistUsers, getComparator(order, orderBy)).slice(
				page * rowsPerPage,
				page * rowsPerPage + rowsPerPage,
			),
		[whitelistUsers, order, orderBy, page, rowsPerPage],
	);

	const handleDelete = () => {
		console.log(selected);
		axios_instance.post("/users/whitelist/delete", {
			ids: selected
		}).then((response) => {
			const data = response.data;
			if (data.user && data.user.whitelist)
				setWhiteListUsers(data.user.whitelist);
			setSelected([]);
		});
	}

	const handleAdd = async () => {
		if (addEmail.length > 0) {
			try {
				await axios_instance.post(`/users/whitelist/add`, {
					email: addEmail
				}).then((response) => {
					const data = response.data;
					if (data.user && data.user.whitelist)
						setWhiteListUsers(data.user.whitelist);
					handleAddClose();
				});
			} catch (error) {
				console.log(error);
				alert("Error adding user to whitelist!");
			}
		}
	};

	const handleAddClose = () => {
		setShowAddDialog(false);
		setAddEmail("");
	};

	return (
		<>
			<Button variant="outlined" startIcon={<AddIcon />} onClick={() => setShowAddDialog(true)}>
				Add User
			</Button>
			<div style={{ height: 400, width: "100%" }}>
				<Box sx={{ width: '100%' }}>
					<Paper sx={{ width: '100%', mb: 2 }}>
						<WhiteListTableToolbar numSelected={selected.length} handleDelete={handleDelete} />
						<TableContainer>
							<Table
								sx={{ minWidth: 750 }}
								aria-labelledby="tableTitle"
								size={'medium'}
							>
								<WhiteListTableHead
									numSelected={selected.length}
									order={order}
									orderBy={orderBy}
									onSelectAllClick={handleSelectAllClick}
									onRequestSort={handleRequestSort}
									rowCount={whitelistUsers.length}
								/>
								<TableBody>
									{visibleRows.map((row, index) => {
										const isItemSelected = isSelected(row._id);
										const labelId = `enhanced-table-checkbox-${index}`;

										return (
											<TableRow
												hover
												onClick={(event) => handleClick(event, row._id)}
												role="checkbox"
												aria-checked={isItemSelected}
												tabIndex={-1}
												key={row._id}
												selected={isItemSelected}
												sx={{ cursor: 'pointer' }}
											>
												<TableCell padding="checkbox">
													<Checkbox
														color="primary"
														checked={isItemSelected}
														inputProps={{
															'aria-labelledby': labelId,
														}}
													/>
												</TableCell>
												<TableCell
													component="th"
													id={labelId}
													scope="row"
													padding="none"
												>
													{row.name}
												</TableCell>
												<TableCell>{row.email}</TableCell>
											</TableRow>
										);
									})}
									{emptyRows > 0 && (
										<TableRow
											style={{
												height: (53) * emptyRows,
											}}
										>
											<TableCell colSpan={6} />
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={whitelistUsers.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</Paper>
				</Box>
			</div>

			<Dialog open={showAddDialog} sx={{ textAlign: "center" }}>
				<DialogTitle
					sx={{
						padding: 2,
						fontWeight: "bold",
						color: "#1976d2",
					}}
				>
					{"Add user to whitelist"}
				</DialogTitle>
				<DialogContent>
					<TextField
						id="add-textbox"
						sx={{ width: 300 }}
						placeholder={'Enter email'}
						value={addEmail}
						onChange={(event) => {
							setAddEmail(event.target.value);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAddClose}>Close</Button>
					<Button onClick={handleAdd} autoFocus>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default Whitelist;
