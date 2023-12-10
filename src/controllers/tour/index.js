const Tour = require("../../models/tour");

const throwErrorMessage = (res, status, message) => {
  console.error("Error: ", message);

  res.status(status).json({
    status: "error",
    message,
  });
};

const filterQuery = (req, excludedFields) => {
  const query = { ...req.query };

  excludedFields.forEach((key) => delete query[key]);

  return query;
};

const getAllTours = async (req, res) => {
  try {
    const query = filterQuery(req, ["page", "sort", "limit", "fields"]);

    const queryWithAttributes = JSON.parse(
      JSON.stringify(query).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`,
      ),
    );

    const request = Tour.find(queryWithAttributes);

    if (req.query.sort) {
      request.sort(req.query.sort.replaceAll(",", " "));
    } else {
      request.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = req.query.fields.replaceAll(",", " ");

      request.select(fields);
    } else {
      request.select("-__v");
    }

    const tours = await request;

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

module.exports = {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  addTour,
};
