import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Button } from "@mui/material";
import axios_instance from '../config';

const UploadFile = () => {
  const [file, setFile] = useState(null);

  const handleFileDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios_instance.post('/file/upload', formData);
      alert('File uploaded successfully!');
    } catch (error) {
      console.log(error);
      alert('Error uploading file!');
    }
  };

  return (
    <>
      <Dropzone onDrop={handleFileDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {file ? (
                <p>{file.name}</p>
              ) : (
                <p>Drag 'n' drop a file here, or click to select a file</p>
              )}
            </div>
          </section>
        )}
      </Dropzone>
      <Button variant="contained" color="primary" onClick={handleFileUpload}>
        Upload
      </Button>
    </>
  );
};

export default UploadFile;
