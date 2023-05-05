import * as React from "react";
import {useMemo, useState} from "react";
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
import {Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField,} from "@mui/material";
import {useDropzone} from "react-dropzone";

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


export default function Dashboard() {
    const [fileData, setFileData] = useState([]);
    const [shareEmail, setShareEmail] = useState("");
    const [showUploaddialog, setShowUploadDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [selectedCard, setselectedCard] = useState(null);

    React.useEffect(() => {
        axios_instance.get("/file").then((data) => {
            setFileData(data.data.files);
        });
    }, []);

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
    } = useDropzone();

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

    const handleDownload = async (card) => {
        if (card) {
            try {
                const response = await axios_instance.get(`/download/file/${card?.fileId?._id}`, {responseType: 'blob'});

                // Create a download link and trigger a click event to download the file
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(new Blob([response.data], {type: response.headers['content-type']}));
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

    const handleShareClose = () => {
        setShowShareDialog(false);
        setselectedCard(null);
        setShareEmail("");
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <Container sx={{py: 10}}>
                <Grid container spacing={4}>
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
                                    <CardMedia sx={{height: 140}} title="doc">
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
                                    <CardContent sx={{flexGrow: 1}}>
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
                                                <Button
                                                    size="small"
                                                    onClick={() => {
                                                        setShowShareDialog(true);
                                                        setselectedCard(card);
                                                    }}
                                                >
                                                    Share
                                                </Button>
                                            )}
                                        <Button size="small" onClick={() => handleDownload(card)}>Download</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Container>

            <BottomNavigation
                sx={{position: "fixed", bottom: 30, right: 50, width: 130}}
            >
                <div sx={{"& > :not(style)": {m: 1}}}>
                    <Fab
                        variant="extended"
                        onClick={() => {
                            setShowUploadDialog(true);
                        }}
                    >
                        <FileUploadIcon sx={{mr: 1}}/>
                        Upload
                    </Fab>
                </div>
            </BottomNavigation>

            <Dialog open={showUploaddialog} sx={{textAlign: "center"}}>
                <DialogTitle
                    sx={{
                        padding: 2,
                        fontWeight: "bold",
                        color: "#1976d2",
                    }}
                >
                    {"Upload File"}
                </DialogTitle>
                <DialogContent>
                    <div className="container">
                        <div {...getRootProps({uploadStyle})}>
                            <input {...getInputProps()} />
                            {acceptedFiles.length > 0 ? (
                                <p>{acceptedFiles[0].name}</p>
                            ) : (
                                <p>Click to browse files</p>
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

            <Dialog open={showShareDialog} sx={{textAlign: "center"}}>
                <DialogTitle
                    sx={{
                        padding: 2,
                        fontWeight: "bold",
                        color: "#1976d2",
                    }}
                >
                    {"Share File"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        id="share-textbox"
                        sx={{width: 300}}
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
        </Box>
    );
}
