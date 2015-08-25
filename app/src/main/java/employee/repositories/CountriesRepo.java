package employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import employee.domain.Department;

@Repository
public interface CountriesRepo extends JpaRepository<Department, Integer> {

}
