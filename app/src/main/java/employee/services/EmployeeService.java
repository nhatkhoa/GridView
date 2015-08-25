package employee.services;

import java.util.List;

import employee.services.viewmodels.EmployeeModel;

public interface EmployeeService {
	List<EmployeeModel> gets();
	EmployeeModel add(EmployeeModel employee);
	EmployeeModel update(EmployeeModel employee);
	void delete(long id);
}
