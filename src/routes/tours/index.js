const express = require('express');

const {getAllTours, getTour, updateTour, addTour, deleteTour} = require('../../controllers/tour')

const router = express.Router();

router.route('/').get(getAllTours).post(addTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
