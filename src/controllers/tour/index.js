const fs = require('fs');
const {FILE_PATHS} = require('../../constants');

const tours = JSON.parse(fs.readFileSync(FILE_PATHS.tours));

const checkId = (req, res, next, val) => {
  const tour = tours.find(({id}) => id === val * 1);

  if (!tour) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid id',
    });
  }

  next()
}

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    count: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const reqId = req.params?.id;
  const tour = tours.find(({id}) => id === reqId * 1);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const addTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const tour = {id: newId, ...req.body};

  tours.push(tour);

  fs.writeFile(FILE_PATHS.tours, JSON.stringify(tours), (error) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  });
};

const updateTour = (req, res) => {
  try {
    const reqId = req.params?.id;
    let newTour = null;

    const newTours = tours.map((tour) => {
      if (tour.id === reqId * 1) {
        newTour = {
          ...tour,
          ...req.body,
        };

        return newTour;
      }

      return tour;
    });

    fs.writeFile(FILE_PATHS.tours, JSON.stringify(newTours), (error) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message,
    });
  }
};

const deleteTour = (req, res) => {
  try {
    const reqId = req.params?.id;
    const tour = tours.find(({id}) => id === reqId * 1);

    if (!tour) {
      throw new Error('Invalid id');
    }

    const newTours = tours.filter((item) => item.id !== tour.id);

    fs.writeFile(FILE_PATHS.tours, JSON.stringify(newTours), (error) => {
      res.status(204).json({
        status: 'success',
        data: null,
      });
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {getAllTours, getTour, updateTour, deleteTour, addTour, checkId};