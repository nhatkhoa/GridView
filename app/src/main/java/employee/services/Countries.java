package employee.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import employee.domain.Department;
import employee.repositories.CountriesRepo;

public class Countries {
	
	@Autowired
	private CountriesRepo repo;
	
	public List<Department> gets(){
		return repo.findAll();
	}
}
