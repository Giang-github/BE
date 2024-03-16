import axios from 'axios';
import publicApi from '../services/api.service';

// all faculty
const getAllFaculties = () => {
    return axios.get(publicApi.faculty);
};

// create faculty 
const createFaculty = async (facultyForm, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('name', facultyForm.name);
        formData.append('description', facultyForm.description);
        formData.append('imageFile', imageFile);

        const response = await axios.post(publicApi.faculty + 'create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating faculty:', error);
        throw error;
    }
};

// update faculty
const updateFaculty = async (id, facultyForm, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('name', facultyForm.name);
        formData.append('description', facultyForm.description);
        formData.append('imageFile', imageFile);

        const response = await axios.put(publicApi.faculty + `update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating faculty:', error);
        throw error;
    }
};


// delete faculty
const deleteFaculty = async (id) => {
    try {
        if (!id) {
            throw new Error('Missing Faculty ID');
        }
        await axios.delete(publicApi.faculty + `delete/${id}`);
    } catch (error) {
        console.error('Error deleting faculty:', error);
        throw error;
    }
};

const facultyService = {
    createFaculty,
    getAllFaculties,
    updateFaculty,
    deleteFaculty,
};

export default facultyService;