package employee.services.viewmodels;

import java.io.Serializable;

public class EmployeeModel implements Serializable {
	

	private static final long serialVersionUID = 1L;

	private long id;

	private String name;

	private int age;

	private boolean gender;

	private int department;
	
	public EmployeeModel() {}

	public EmployeeModel(long id, String name, int age, boolean gender, int department) {
		this.id = id;
		this.name = name;
		this.age = age;
		this.gender = gender;
		this.department = department;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public boolean isGender() {
		return gender;
	}

	public void setGender(boolean gender) {
		this.gender = gender;
	}

	public int getDepartment() {
		return department;
	}

	public void setDepartment(int department) {
		this.department = department;
	}
	
	
}
