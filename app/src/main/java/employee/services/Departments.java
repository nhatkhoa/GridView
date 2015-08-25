package employee.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import employee.domain.Department;
import employee.repositories.DepartmentsRepo;
import employee.repositories.EmployeesRepo;

@Repository
public class Departments implements DepartmentService {
	
	@Autowired
	private EmployeesRepo eRepo;
	
	@Autowired
	private DepartmentsRepo dRepo;
	
	public List<Department> gets(){
		if(dRepo.findAll().isEmpty())
			DataSample.initData(eRepo, dRepo);	
		return dRepo.findAll();
	}
}
