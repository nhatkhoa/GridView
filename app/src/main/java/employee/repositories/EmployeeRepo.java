
package employee.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import employee.domain.Employee;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, Long> {

}
