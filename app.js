const express = require('express');
const fs = require('fs');

const FILE_PATHS = {
  tours: `${__dirname}/dev-data/data/tours-simple.json`,
};

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();

  next();
});

const PORT = 3000;

const API_VERSION = 1;

const ROUTS = {
  route: `/api/v${API_VERSION}`,
  tours: `/api/v${API_VERSION}/tours`,
  tour: `/api/v${API_VERSION}/tours/:id`,
};

const tours = JSON.parse(fs.readFileSync(FILE_PATHS.tours));

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
  const tour = tours.find(({ id }) => id === reqId * 1);

  if (!tour) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const addTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const tour = { id: newId, ...req.body };

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

    if (!reqId) {
      throw new Error('Missed id');
    }

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

    if (!newTour) {
      throw new Error('Invalid id');
    }

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
    const tour = tours.find(({ id }) => id === reqId * 1);

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

app.route(ROUTS.tours).get(getAllTours).post(addTour);

app.route(ROUTS.tour).get(getTour).patch(updateTour).delete(deleteTour);

app.listen(PORT, '127.0.0.1', () => console.log(`App running on port ${PORT}`));
