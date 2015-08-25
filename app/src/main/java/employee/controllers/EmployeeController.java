
package employee.controllers;


import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import employee.services.EmployeeService;
import employee.services.viewmodels.EmployeeModel;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private static Logger log = Logger.getLogger(EmployeeController.class);
    @Autowired
    private EmployeeService service;

    @RequestMapping(value = "/add",
                    method = RequestMethod.POST,
                    produces = "application/json")
    public EmployeeModel add(final EmployeeModel employeeModel) throws Exception {

        try {
            return service.add(employeeModel);
        } catch (Exception e) {
            log.error(e);
            throw e;
        }
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.GET)
    public void delete(@PathVariable("id") final long id) {

        service.delete(id);
    }

    @RequestMapping(value = "/",
                    method = RequestMethod.GET,
                    produces = "application/json")
    public List<EmployeeModel> gets() {

        return service.gets();
    }

    @RequestMapping(value = "/",
                    method = RequestMethod.POST,
                    produces = "application/json")
    public EmployeeModel update(final EmployeeModel employeeModel) throws Exception {

        try {
            return service.update(employeeModel);
        } catch (Exception e) {
            log.error(e);
            throw e;
        }
    }

}
