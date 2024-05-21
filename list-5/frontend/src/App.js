import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileList from './components/FileList';
import { deleteFile, fetchFiles } from './services/fileOperations';
import FileUpload from './components/FileUpload';

const App = () => {
    const [files, setFiles] = useState([]);

    const refreshFiles = async () => {
        setFiles(await fetchFiles());
    };

    const deleteFilesAndRefresh = async (id) => {
        await deleteFile(id);
        await refreshFiles().catch(console.trace);
    };

    useEffect(() => {
        refreshFiles().catch(console.trace);
    }, []);

    return (
        <div className="App">
            <FileUpload refreshFn={refreshFiles} />

            <FileList
                files={files}
                refreshFn={refreshFiles}
                deleteFile={deleteFilesAndRefresh}
            />
        </div>
    );
};

export default App;
