
package employee.controllers;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import employee.domain.Department;
import employee.services.DepartmentService;

@RestController
@RequestMapping("/departments")
public class DepartmentController {
    
    @Autowired
    private DepartmentService service;
    
    @RequestMapping(value = "/",
                    method = RequestMethod.GET,
                    produces = "application/json")
    public List<Department> gets() {
        
        return service.gets();
    }
    
}
