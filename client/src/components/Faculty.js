import React, { useState, useEffect } from 'react';
import FacultyService from '../services/faculty.service';

const FacultyComponent = () => {
    //Sử dụng useState để lưu trữ danh sách các faculty và useEffect để gọi hàm fetchFaculties khi component được render lần đầu tiên.
    // const [faculties, setFaculties] = useState([]);
    const [faculties, setFaculties] = useState([]);


    useEffect(() => {
        fetchFaculties();
    }, []);

    //Hàm fetchFaculties gửi yêu cầu GET đến API server để lấy danh sách các faculty và cập nhật state faculties.
    const fetchFaculties = async () => {
        try {
        const response = await FacultyService.getAllFaculties();
        setFaculties(response.data);
        } catch (error) {
        console.error('Error fetching faculties:', error);
        }
    };

    //create faculty
    // const handleCreate = () => {
    //     // Chuyển hướng đến trang tạo mới faculty
    //     // history.push('/faculties/create');
    // };

    //edit faculty
    const handleEdit = (id) => {
        // Chuyển hướng đến trang chỉnh sửa faculty với id được chọn
        // Ví dụ: history.push(`/faculties/${id}/edit`);
    };

    //delete faculty
    const handleDelete = async (id) => {
        try {
            const confirmDelete = window.confirm('Are you sure you want to delete this faculty?');
            if (confirmDelete) {
                await FacultyService.deleteFaculty(id);
                setFaculties(faculties.filter(faculty => faculty._id !== id));
            }
        } catch (error) {
            console.error('Error deleting faculty:', error);
        }
    };
    return (
        <div>
        <button onClick={() => {/* Chuyển hướng đến trang tạo mới faculty */}}>Create Faculty</button>
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {faculties && faculties.map(faculty => (
                <tr key={faculty._id}>
                <td>{faculty.name}</td>
                <td>{faculty.image}</td>
                <td>{faculty.description}</td>
                <td>
                    <button onClick={() => handleEdit(faculty._id)}>Edit</button> {/* Chuyển hướng đến trang edit faculty */}
                    <button onClick={() => handleDelete(faculty._id)}>Delete</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default FacultyComponent;

