
package employee.services;


import employee.domain.Department;
import employee.domain.Employee;
import employee.repositories.DepartmentRepo;
import employee.repositories.EmployeeRepo;
import employee.services.viewmodels.EmployeeModel;

public class Utils {
    
    public static Department getDepartment(final DepartmentRepo repo, final int id) throws Exception {
        
        Department department = repo.findOne(id);
        if (department == null)
            throw new Exception("ID of department is illegal or not exactly. ID :"
                    + id);
                    
        return department;
    }
    
    public static Employee getEmployee(final EmployeeRepo repo, final long id) throws Exception {
        
        Employee employee = repo.findOne(id);
        if (employee == null)
            throw new Exception("There are no employee has id equal " + id);
            
        return employee;
    }
    
    public static EmployeeModel parseEmployeeModel(final Employee employee) {
        
        return new EmployeeModel(employee.getId(), employee.getName(),
                                 employee.getAge(), employee.isMale(),
                                 employee.getDepartment().getId());
    }
}
