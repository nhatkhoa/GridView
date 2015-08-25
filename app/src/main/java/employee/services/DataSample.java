
package employee.services;


import java.util.ArrayList;
import java.util.List;

import employee.domain.Department;
import employee.domain.Employee;
import employee.repositories.DepartmentRepo;
import employee.repositories.EmployeeRepo;

public class DataSample {
    
    public static void initData(EmployeeRepo employeeRepo, DepartmentRepo departmentRepo) {
        
        Department human = new Department("Human Resources");
        departmentRepo.save(human);
        Department it = new Department("Information Technology");
        departmentRepo.save(it);
        Department superMan = new Department("Super Man!");
        departmentRepo.save(superMan);
        
        List<Employee> employees = new ArrayList<Employee>();
        employees.add(new Employee("Choi Kane Ta", 21, true, human));
        employees.add(new Employee("Kazate Hoang", 23, true, it));
        employees.add(new Employee("Hoàng Võ Nhật Khoa", 21, true, superMan));
        employees.add(new Employee("Dương Tuyết Kiến", 22, false, human));
        
        employeeRepo.save(employees);
        
    }
}
