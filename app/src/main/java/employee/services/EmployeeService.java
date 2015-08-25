package employee.services;

import java.util.Set;

import employee.services.viewmodels.EmployeeModel;

public interface EmployeeService {
	Set<EmployeeModel> gets();
	EmployeeModel add(EmployeeModel employee);
	EmployeeModel update(EmployeeModel employee);
	void delete(long id);
}
