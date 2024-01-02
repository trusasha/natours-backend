const express = require("express");

const {
  getAllTours,
  getTour,
  updateTour,
  addTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require("../../controllers/tour");

const router = express.Router();

router.route("/tour-stats").get(getTourStats);
router.route("/top-5-tours").get(aliasTopTours, getAllTours);
router.route("/get-monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(getAllTours).post(addTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
