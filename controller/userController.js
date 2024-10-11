const { User } = require("../models");
const Imagekit = require("../lib/imagekit")

// Function for get all user data
async function getAllUser(req, res) {
    try {
        const users = await User.findAll();
        res.status(200).json({
            status: "Success",
            message: "Successfully obtained users data",
            isSuccess: true,
            data: { users },
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Failed to get users data",
            isSuccess: false,
            data: null,
            error: error.message,
        });
    }
}

// Function for get user data by id
async function getUserById(req, res) {
    const id = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "Can't find spesific id user",
                isSuccess: false,
                data: null,
            });
        }
        res.status(200).json({
            status: "Success",
            message: "Successfully obtained user data",
            isSuccess: true,
            data: { user },
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Failed to get user data",
            isSuccess: false,
            data: null,
            error: error.message,
        });
    }
}

// Function for delete user by id
async function deleteUserById(req, res) {
    const id = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "Can't find spesific id user",
                isSuccess: false,
                data: null,
            });
        }

        await user.destroy();

        res.status(200).json({
            status: "Success",
            message: "Successfully delete user data",
            isSuccess: true,
            data: { user },
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Failed to delete user data",
            isSuccess: false,
            data: null,
            error: error.message,
        });
    }
}

// Function for update user by id
async function UpdateUserById(req, res) {
    const { firstName, lastName, age, phoneNumber } = req.body;
    const id = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "Can't find spesific id user",
                isSuccess: false,
                data: null,
            });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.age = age;
        user.phoneNumber = phoneNumber;

        await user.save();

        res.status(200).json({
            status: "Success",
            message: "Successfully update user data",
            isSuccess: true,
            data: { user },
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Failed to update user data",
            isSuccess: false,
            data: null,
            error: error.message,
        });
    }
}

async function createUser(req, res) {
    const file = req.file;
    console.log(req.file);
    // processing filenya

    // 1. split untuk dapat nama file dan extensionnya
    const split = file.originalname.split(".")
    //split budi.pdf = ['budi', 'pdf'] = length 2
    const ext = split[split.length -  1];
    const fileName = split[0]

    // 2. upload image ke server
    const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `Profile-${Date.now()}.${ext}`
    })

    console.log(uploadedImage)

    if (!uploadedImage) {
        return res.status(400).json({
            status: "Failed",
            message: "Failed to add user data image",
            isSuccess: false,
            data: null,
            error: error.message,
        });
    } 
    
    
    const newUser = req.body;

    try {
        await User.create({ ...newUser, photoProfile: uploadedImage.url });

        res.status(200).json({
            status: "Success",
            message: "Successfully added user data",
            isSuccess: true,
            data: { ...newUser, photoProfile: uploadedImage.url },
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Failed to add user data",
            isSuccess: false,
            data: null,
            error: error.message,
        });
    }
}

module.exports = {
    getAllUser,
    getUserById,
    deleteUserById,
    UpdateUserById,
    createUser,
};
