import React, { useState } from 'react';
import { uploadFile } from '../services/fileOperations';

/* eslint-disable react/prop-types */
const FileUpload = ({ refreshFn }) => {
    const [file, setFile] = useState(null);

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const upload = async () => {
        await uploadFile(file);
        await refreshFn();
    };

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            <button onClick={() => upload()}>Upload file!</button>
        </div>
    );
};

export default FileUpload;
