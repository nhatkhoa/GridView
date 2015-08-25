package employee.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import employee.repositories.DepartmentsRepo;
import employee.repositories.EmployeesRepo;
import employee.services.viewmodels.EmployeeModel;

@Service
public class Employees implements EmployeeService {
	
	@Autowired
	private EmployeesRepo employeeRepo;
	
	@Autowired
	private DepartmentsRepo departmentRepo;
	
	@Override
	public List<EmployeeModel> gets() {
		
		if(employeeRepo.findAll().isEmpty())
			DataSample.initData(employeeRepo, departmentRepo);
		
		List<EmployeeModel> employees =  employeeRepo
				.findAll().stream()
				.map(e -> new EmployeeModel(e.getId(), e.getName(), e.getAge(), e.isMale() , e.getDepartment().getId()))
				.collect(Collectors.toList());
	
		return employees;
	}



	@Override
	public EmployeeModel add(EmployeeModel employee) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public EmployeeModel update(EmployeeModel employee) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void delete(long id) {
		// TODO Auto-generated method stub

	}

}
