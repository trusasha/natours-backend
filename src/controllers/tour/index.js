const Tour = require("../../models/tour");
const ApiFeatures = require("../../utils/api-features");

const throwErrorMessage = (res, status, message) => {
  console.error("Error: ", message);

  res.status(status).json({
    status: "error",
    message,
  });
};

const aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingAverage,summary,difficulty";

  next();
};

const getAllTours = async (req, res) => {
  try {
    const features = new ApiFeatures(Tour.find(), req.query)
      .limitFields()
      .pagination()
      .filter()
      .sort();

    const tours = await features.query;

    res.status(200).json({
      status: "success",
      count: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    throwErrorMessage(res, 404, error);
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    throwErrorMessage(res, 404, error);
  }
};

const addTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    throwErrorMessage(res, 400, error);
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    throwErrorMessage(res, 400, error);
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndRemove(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    throwErrorMessage(res, 400, error);
  }
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingAverage: { $gte: 0 },
        },
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          avgRating: { $avg: "$ratingAverage" },
          numRatings: { $sum: "$ratingQuantity" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(201).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error) {
    throwErrorMessage(res, 400, error);
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; //2021

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$startDates",
          },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(201).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (error) {
    throwErrorMessage(res, 400, error);
  }
};

module.exports = {
  aliasTopTours,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
  getTourStats,
  getMonthlyPlan,
};
