import React, { useState } from 'react';
import { downloadFile, renameFile } from '../services/fileOperations';

const FileList = ({ files, refreshFn, deleteFile }) => {
    const [newName, setNewName] = useState({});

    const handleFileNameChange = async (id) => {
        if (!newName[id]) {
            alert('Please enter a new name first.');
            return;
        }

        await renameFile(id, newName[id]);
        refreshFn().catch(console.trace);
    };

    const handleLocalNameChange = (id, value) =>
        setNewName((prev) => ({ ...prev, [id]: value }));

    return (
        <div>
            <h2>List of Files</h2>
            <ul>
                {files.map((file) => (
                    <li key={file.id}>
                        {file.id}

                        <input
                            type="text"
                            placeholder="New file name"
                            value={newName[file.id] ?? file.name}
                            onChange={(e) =>
                                handleLocalNameChange(file.id, e.target.value)
                            }
                        />
                        <button onClick={() => handleFileNameChange(file.id)}>
                            Change Name
                        </button>
                        <button onClick={() => deleteFile(file.id)}>
                            Delete
                        </button>
                        <button onClick={() => downloadFile(file)}>
                            Download
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
