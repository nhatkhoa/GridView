package employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import employee.domain.Country;

@Repository
public interface CountriesRepo extends JpaRepository<Country, Integer> {

}
