
package employee.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import employee.domain.Department;

@Repository
public interface DepartmentRepo extends JpaRepository<Department, Integer> {

}
