
package employee.services;


import java.util.List;
import java.util.stream.Collectors;

import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import employee.domain.Department;
import employee.domain.Employee;
import employee.repositories.DepartmentRepo;
import employee.repositories.EmployeeRepo;
import employee.services.viewmodels.EmployeeModel;

@Service
public class Employees implements EmployeeService {
    
    @Autowired
    private EmployeeRepo employeeRepo;
    
    @Autowired
    private DepartmentRepo departmentRepo;
    
    @Override
    public EmployeeModel add(final EmployeeModel employee) throws Exception {
        
        Department department = Utils.getDepartment(departmentRepo,
                                                    employee.getDepartment());
                                                    
        Employee temp = new Employee(employee.getName(), employee.getAge(),
                                     employee.isGender(), department);
        Employee newEmployee = employeeRepo.save(temp);
        
        if (newEmployee == null)
            throw new Exception("Can not add new employee to database.");
            
        return Utils.parseEmployeeModel(newEmployee);
    }
    
    @Override
    public void delete(final long id) {
        
        employeeRepo.delete(id);
        
        Assert.assertNull(employeeRepo.findOne(id));
    }
    
    @Override
    public List<EmployeeModel> gets() {
        
        if (employeeRepo.findAll().isEmpty())
            DataSample.initData(employeeRepo, departmentRepo);
            
        List<EmployeeModel> employees = employeeRepo.findAll().stream()
                                                    .map(employee -> Utils.parseEmployeeModel(employee))
                                                    .collect(Collectors.toList());
                                                    
        return employees;
    }
    
    @Override
    public EmployeeModel update(final EmployeeModel employee) throws Exception {
        
        long id = employee.getId();
        Employee oldEmployee = Utils.getEmployee(employeeRepo, id);
        oldEmployee.setName(employee.getName());
        oldEmployee.setAge(employee.getAge());
        oldEmployee.setMale(employee.isGender());
        oldEmployee.setDepartment(Utils.getDepartment(departmentRepo,
                                                      employee.getDepartment()));
        Employee updatedEmployee = employeeRepo.saveAndFlush(oldEmployee);
        
        return Utils.parseEmployeeModel(updatedEmployee);
    }
    
}
