package employee.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
//	/.stream().map(e-> new EmployeeModel(e.getId(), e.getName(), e.getAge(),e.getGender() , e.getCountry().getId()))
	@RequestMapping(value = "/", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<List<EmployeeModel>> gets(){
		return new ResponseEntity<List<EmployeeModel>>(service.gets(), HttpStatus.ACCEPTED);
	}
	
	
}
