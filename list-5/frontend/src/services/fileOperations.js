import axios from 'axios';

const METHOD = 'http';
const ROOT = 'localhost';
const PORT = '8080';

const BACKEND_URI = `${METHOD}://${ROOT}:${PORT}`;
const API_URI = `${BACKEND_URI}/api/files`;

export const downloadFile = async (file) => {
    try {
        const response = await axios({
            url: `${API_URI}/${file.id}`,
            method: 'GET',
            responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], {
            type: response.headers['content-type'],
        });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(link.href);
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};

export const renameFile = async (id, fileName) => {
    try {
        const response = await axios.put(
            `${API_URI}/${id}?fileName=${fileName}`,
        );

        return response.data;
    } catch (error) {
        console.error('Error renaming file:', error);
        throw error;
    }
};

export const fetchFiles = async () =>
    axios
        .get(API_URI)
        .then((response) => response.data)
        .catch((error) => console.log(error));

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    await axios
        .post(API_URI, formData)
        .then((response) => alert('File uploaded successfully'))
        .catch((error) => {
            alert('Error uploading file');
            console.log(error);
        });
};

export const deleteFile = async (key) => {
    await axios
        .delete(`${API_URI}/${key}`)
        .then((response) => {
            alert('File deleted successfully');
        })
        .catch((error) => {
            alert('Error deletaing file');
            console.log(error);
        });
};
