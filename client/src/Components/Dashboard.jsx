import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Fab from "@mui/material/Fab";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import ArticleIcon from "@mui/icons-material/Article";
import BottomNavigation from "@mui/material/BottomNavigation";
import axios_instance from "../config";
import {
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    TextField,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import SearchIcon from "@mui/icons-material/Search";
import {alpha, styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
};

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));


export default function Dashboard() {
    const [fileData, setFileData] = useState([]);
    const [shareEmail, setShareEmail] = useState("");
    const [showUploaddialog, setShowUploadDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [selectedCard, setselectedCard] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);

    React.useEffect(() => {
        fetchAllFiles();
    }, []);

    const fetchAllFiles = async () => {
        axios_instance.get("/file").then((data) => {
            setFileData(data.data.files);
        });
    };

    const removeAll = () => {
        acceptedFiles.length = 0;
        acceptedFiles.splice(0, acceptedFiles.length);
        inputRef.current.value = "";
    };

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        inputRef,
    } = useDropzone({
        maxFiles: 1
    });

    const uploadStyle = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        try {
            await axios_instance.post("/file/upload", formData);
            handleUploadClose();
        } catch (error) {
            console.log(error);
            alert("Error uploading file!");
        }
    };

    const handleUploadClose = () => {
        setShowUploadDialog(false);
        removeAll();
        axios_instance.get("/file/").then((data) => {
            setFileData(data.data.files);
        });
    };

    const handleShare = async () => {
        if (selectedCard) {
            try {
                await axios_instance.post(`/file/${selectedCard?.fileId?._id}/share`, {
                    email: shareEmail
                });
                handleShareClose();
            } catch (error) {
                console.log(error);
                alert("Error uploading file!");
            }
        }
    };

    const handleShareClose = () => {
        setShowShareDialog(false);
        setselectedCard(null);
        setShareEmail("");
    };

    const handleDelete = async () => {
        if (selectedCard) {
            try {
                await axios_instance.delete(`/delete/file/${selectedCard?.fileId?._id}`).then(() => {
                    fetchAllFiles();
                    handleDeleteClose();
                });
            } catch (error) {
                console.log(error);
                alert("Error deleting file!");
            }
        }
    };

    const handleDeleteClose = () => {
        setShowDeleteWarning(false);
        setselectedCard(null);
    };

    const handleDownload = async (card) => {
        if (card) {
            try {
                const response = await axios_instance.get(`/download/file/${card?.fileId?._id}`, { responseType: 'blob' });

                // Create a download link and trigger a click event to download the file
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
                downloadLink.setAttribute('download', card.fileId.filename + '.' + response.headers['content-type'].split('/')[1]);
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } catch (error) {
                console.log(error);
                alert("Error downloading file!");
            }
        }

    }

    useEffect( () => {
        if (searchText.length > 0) {
            searchFiles();
        }else{
            fetchAllFiles();
        }
    }, [searchText]);

    const searchFiles = async () => {
        try {
            await axios_instance.get(`/file/search?text=${searchText}`).then((response) => {
                setFileData(response.data.files);
            });
        } catch (error) {
            console.log(error);
            alert("Error downloading file!");
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Container sx={{ py: 10 }}>
                <Grid container justifyContent="space-between" spacing={2}>
                    <Grid item>
                        <Typography variant="h5" marginBottom={2}>
                            My Files
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ "aria-label": "search" }}
                                onChange={(event) => {
                                    setSearchText(event.target.value);
                                }}
                            />
                        </Search>
                    </Grid>
                </Grid>
                <Divider />
                <Grid sx={{ marginTop: 1 }} container spacing={4}>
                    {fileData &&
                        fileData.map((card) => (
                            <Grid item key={card.fileId._id} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
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
                                    <CardContent sx={{ flexGrow: 1 }}>
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
                                        {JSON.parse(localStorage.user)._doc._id ===
                                            card.userId._id && (
                                                <>
                                                    <IconButton color="primary" aria-label="share file" component="label" onClick={() => {
                                                        setShowShareDialog(true);
                                                        setselectedCard(card);
                                                    }}>
                                                        <ShareIcon />
                                                    </IconButton>
                                                    <IconButton color="primary" aria-label="delete file" component="label" onClick={() => {
                                                        setShowDeleteWarning(true);
                                                        setselectedCard(card);
                                                    }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    {/* <IconButton color="primary" aria-label="rename file" component="label" onClick={() => {
                                                        // setShowShareDialog(true);
                                                        // setselectedCard(card);
                                                    }}>
                                                        <EditIcon />
                                                    </IconButton> */}
                                                </>
                                            )}
                                        <IconButton color="primary" aria-label="download file" component="label" onClick={() => {
                                            handleDownload(card)
                                        }}>
                                            <DownloadIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Container>

            <BottomNavigation
                sx={{ position: "fixed", bottom: 30, right: 50, width: 130 }}
            >
                <div sx={{ "& > :not(style)": { m: 1 } }}>
                    <Fab
                        variant="extended"
                        onClick={() => {
                            setShowUploadDialog(true);
                        }}
                    >
                        <FileUploadIcon sx={{ mr: 1 }} />
                        Upload
                    </Fab>
                </div>
            </BottomNavigation>

            <Dialog open={showUploaddialog} sx={{ textAlign: "center" }}>
                <DialogTitle
                    sx={{
                        padding: 2,
                        fontWeight: "bold",
                    }}
                >
                    {"Upload File"}
                </DialogTitle>
                <DialogContent>
                    <div className="container">
                        <div {...getRootProps({ className: 'dropzone' })} style={uploadStyle}>
                            <input {...getInputProps()} />
                            {acceptedFiles.length > 0 ? (
                                <p>{acceptedFiles[0].name}</p>
                            ) : (
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadClose}>Close</Button>
                    <Button onClick={handleFileUpload} autoFocus>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showShareDialog} sx={{ textAlign: "center" }}>
                <DialogTitle
                    sx={{
                        padding: 2,
                        fontWeight: "bold",
                    }}
                >
                    {"Share File"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        id="share-textbox"
                        sx={{ width: 300 }}
                        placeholder={'Enter email'}
                        value={shareEmail}
                        onChange={(event) => {
                            setShareEmail(event.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleShareClose}>Close</Button>
                    <Button onClick={handleShare} autoFocus>
                        Share
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showDeleteWarning}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title"
                >
                    {"WARNING"}
                </DialogTitle>
                <DialogContent sx={{maxWidth:'500px'}} id="alert-dialog-description">
                    <Typography variant="body2">
                        Do you want to permanently delete {selectedCard?.fileId?.filename}?
                    </Typography>
                    <Typography variant="body2">
                        All the user's who have access to this file can no longer access the this file.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
