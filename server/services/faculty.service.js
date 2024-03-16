// hhhmm
const Faculty = require("../models/faculty");
const cloudinaryService = require("../services/cloudinary.service");

const facultyService = {
  async createFaculty(facultyForm, imageFile) {
    try {
      let imageName = null;

      // Nếu có ảnh được tải lên, thực hiện upload lên Cloudinary
      if (imageFile) {
        imageName = await cloudinaryService.uploadImageToCloudinary(
          imageFile.buffer,
          facultyForm.name
        );
      }

      // Tạo faculty mới
      const faculty = new Faculty({
        name: facultyForm.name,
        image: imageName, // Nếu không có ảnh, imageName sẽ là null
        description: facultyForm.description,
      });

      // Lưu faculty vào cơ sở dữ liệu
      return await faculty.save();
    } catch (error) {
      throw new Error(error);
    }
  },

  // get all Faculty
  async getAllFaculties() {
    try {
      return await Faculty.find();
    } catch (error) {
      throw new Error(error);
    }
  },

  // update Faculty
  async updateFaculty(id, facultyForm) {
    try {
      const faculty = await Faculty.findById(id);
      if (!faculty) {
        throw new Error("Không tìm thấy faculty");
      }

      // Cập nhật thông tin của faculty
      if (facultyForm.name) {
        faculty.name = facultyForm.name;
      }
      if (facultyForm.description) {
        faculty.description = facultyForm.description;
      }
      // Kiểm tra và cập nhật ảnh nếu có
      if (facultyForm.imageFile) {
        const imageName = await cloudinaryService.uploadImageToCloudinary(
          facultyForm.imageFile.buffer,
          facultyForm.name
        );
        faculty.image = imageName;
      }

      // Lưu faculty đã cập nhật vào cơ sở dữ liệu
      return await faculty.save();
    } catch (error) {
      throw new Error(error);
    }
  },

  // delete Faculty
  async deleteFaculty(id) {
    try {
      const deletedFaculty = await Faculty.findByIdAndDelete(id);
      if (!deletedFaculty) {
        throw new Error("Không tìm thấy faculty");
      }
      return { message: "Xóa faculty thành công" };
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = facultyService;
