import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Fab from "@mui/material/Fab";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import ArticleIcon from "@mui/icons-material/Article";


import BottomNavigation from "@mui/material/BottomNavigation";
import { useState } from "react";
import axios_instance from "../config";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import {useDropzone} from 'react-dropzone';

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function CardList(props) {
  // Assuming that the "cards" prop is an array of objects
  const cards = props.cards;

  return (
    <div style={{display:"flex"}}>
      {cards.map((card) => (
    <Card sx={{ width: 345, margin: 5 }}>
    
    <CardMedia
      sx={{ height: 140 }}
      title="doc"
    >
      <ArticleIcon sx={{width: 90, height: 100, position: "relative", left: 120, top: 40}}></ArticleIcon>
    </CardMedia>
    
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {card.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {card.description}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {card.date}
      </Typography>
    </CardContent>
    
    <CardActions>
      <Button size="small">Share</Button>
      <Button size="small">Download</Button>
    </CardActions>
    
  </Card>
  ))}
  </div>
);
}



export default function Dashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [fileData, setFileData] = useState([]);
  // setFileData(data)
  React.useEffect(() => {
    axios_instance.get("/file").then((data) => {
      // console.log(data.data);
      setFileData(data.data.files);
    });
  }, [fileData]);

  const [showUploaddialog, setShowUploadDialog] = useState(false);

  // const cards = fileData.files;
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Dashboard
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Typography variant="h6">Profile</Typography>
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: { md: "flex" } }}>
        <div style={{ display: "flex" }}>
          {fileData.map((card) => (
            <Card key={card.fileId._id} sx={{ width: 345, margin: 5 }}>
              <CardMedia sx={{ height: 140 }} title="doc">
                <ArticleIcon
                  sx={{
                    width: 90,
                    height: 100,
                    position: "relative",
                    left: 120,
                    top: 40,
                  }}
                ></ArticleIcon>
              </CardMedia>

              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {card.fileId.filename}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.userId.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.fileId.createdAt}
                </Typography>
              </CardContent>

              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Download</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </Box>

      <BottomNavigation
        sx={{ position: "fixed", bottom: 30, right: 50, width: 130 }}
      >
        <div sx={{ "& > :not(style)": { m: 1 } }}>
          <Fab
            size="medium"
            aria-label="upload"
            sx={{ width: 130, backgroundColor: "text.disabled" }}
            onClick={() => {
              setShowUploadDialog(true);
            }}
          >
            <FileUploadIcon></FileUploadIcon>
            Upload
          </Fab>
        </div>
      </BottomNavigation>
      {renderMobileMenu}
      {renderMenu}
      <Dialog open={showUploaddialog} sx={{textAlign: "center"}}>
        <DialogTitle sx={{padding: 2, fontWeight: "bold", color: "#1976d2", fontSize: "30px"}}>{"Upload File"}</DialogTitle>
        <DialogContent sx={{minWidth: "80vh"}}>
          {/* <DialogContentText id="alert-dialog-description">
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText> */}
        <section className="container" >
        
      <div {...getRootProps({className: 'dropzone'})} sx={{ marginLeft: "100px", marginRight: "100px", padding: "5px", backgroundColor:"grey"}}>
        <input {...getInputProps()} />
        <Typography variant="h6" gutterBottom>Drag 'n' Drop OR Browse Files to Upload</Typography>
        <FileUploadIcon sx={{fontSize: 50}}></FileUploadIcon>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
        </DialogContent>
        {/* <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose} autoFocus>
          Agree
        </Button>
      </DialogActions> */}
      </Dialog>
    </Box>
  );

}