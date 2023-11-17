const express = require('express')
const router = express.Router();
const employeesController = require('../../controllers/EmployeesController');


router.route('/')
    .get(employeesController.getAllEMployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;