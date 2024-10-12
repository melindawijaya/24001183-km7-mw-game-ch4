const { Car } = require("../models");
const Imagekit = require("../lib/imagekit");

async function getAllCars(req, res) {
    try {
        // console.log("proses kapan request")
        // console.log(req.requestTime)
        // console.log("proses siapa yang request")
        // console.log(req.username)
        // console.log("proses API apa yang diminta")
        // console.log(req.originalUrl)

        const cars = await Car.findAll();

        res.status(200).json({
            statusCode: "200",
            message: "Success get cars data",
            isSuccess: true,
            data: { cars },
        });
    } catch (error) {
        res.status(500).json({
            statusCode: "500",
            message: "Failed to get cars data",
            isSuccess: false,
            error: error.message,
        });
    }
}

async function getCarById(req, res) {
    const id = req.params.id;
    try {
        const car = await Car.findByPk(id);

        if (!car) {
            return res.status(404).json({
                statusCode: "404",
                message: "Car Not Found!",
            });
        }

        res.status(200).json({
            statusCode: "200",
            message: "Success get cars data",
            isSuccess: true,
            data: { car },
        });
    } catch (error) {
        res.status(500).json({
            statusCode: "500",
            message: "Failed to get cars data",
            isSuccess: false,
            error: error.message,
        });
    }
}

async function deleteCarById(req, res) {
    const id = req.params.id;
    try {
        const car = await Car.findByPk(id);

        if (car) {
            await car.destroy();

            res.status(200).json({
                statusCode: "200",
                message: "Success get cars data",
                isSuccess: true,
                data: { car },
            });
        } else {
            res.status(404).json({
                statusCode: "404",
                message: "Car Not Found!",
            });
        }
    } catch (error) {
        res.status(500).json({
            statusCode: "500",
            message: "Failed to get cars data",
            isSuccess: false,
            error: error.message,
        });
    }
}

async function updateCar(req, res) {
    const id = req.params.id;
    const { plate, model, type, year } = req.body;

    try {
        const car = await Car.findByPk(id);

        if (car) {
            car.plate = plate;
            car.model = model;
            car.type = type;
            car.year = year;

            await car.save();

            res.status(200).json({
                statusCode: "200",
                message: "Success get cars data",
                isSuccess: true,
                data: { car },
            });
        } else {
            res.status(404).json({
                statusCode: "404",
                message: "Car Not Found!",
            });
        }
    } catch (error) {
        res.status(500).json({
            statusCode: "500",
            message: "Failed to get cars data",
            isSuccess: false,
            error: error.message,
        });
    }
}

async function createCar(req, res) {
    const { plate, model, type, year } = req.body;
    const carsImages = req.files;

    if (!carsImages || carsImages.length === 0) {
        return res.status(400).json({
            status: "Failed",
            message: "No images uploaded",
            isSuccess: false,
        });
    }

    try {
        let uploadedImages = [];
        for (let i = 0; i < carsImages.length; i++) {
            const file = carsImages[i];
            const split = file.originalname.split(".");
            const ext = split[split.length - 1];

            const uploadedImage = await Imagekit.upload({
                file: file.buffer,
                fileName: `Car-${Date.now()}-${i}.${ext}`
            });

            uploadedImages.push(uploadedImage.url);
        }

        const newCar = await Car.create({ 
            plate, 
            model, 
            type, 
            year,
            carsImage: uploadedImages 
        });

        res.status(201).json({
            statusCode: "201",
            message: "Mobil berhasil ditambahkan",
            isSuccess: true,
            data: { newCar },
        });
    } catch (error) {
        res.status(500).json({
            statusCode: "500",
            message: "Gagal menambahkan data mobil",
            isSuccess: false,
            error: error.message,
        });
    }
}

module.exports = {
    createCar,
    getAllCars,
    getCarById,
    deleteCarById,
    updateCar,
};
