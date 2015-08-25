package employee.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import employee.domain.Country;
import employee.repositories.CountriesRepo;

public class Countries {
	
	@Autowired
	private CountriesRepo repo;
	
	public List<Country> gets(){
		return repo.findAll();
	}
}
