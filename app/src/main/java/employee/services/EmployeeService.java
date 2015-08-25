
package employee.services;


import java.util.List;

import employee.services.viewmodels.EmployeeModel;

public interface EmployeeService {
    
    EmployeeModel add(EmployeeModel employee) throws Exception;
    
    void delete(long id);
    
    List<EmployeeModel> gets();
    
    EmployeeModel update(EmployeeModel employee) throws Exception;
}
