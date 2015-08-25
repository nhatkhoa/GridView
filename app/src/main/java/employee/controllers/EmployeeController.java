package employee.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import employee.services.EmployeeService;
import employee.services.viewmodels.EmployeeModel;

@RestController
@RequestMapping("/employees")
public class EmployeeController {
	
	@Autowired
	private EmployeeService service;

	@RequestMapping(value = "/", method = RequestMethod.GET, produces = "application/json")
	public List<EmployeeModel> gets(){
		return service.gets();
	}
	
}
