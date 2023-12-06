const express = require('express');

const {getAllTours, getTour, updateTour, addTour, deleteTour, checkId} = require('../../controllers/tour');

const router = express.Router();

router.param('id', checkId);

router.route('/').get(getAllTours).post(addTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
