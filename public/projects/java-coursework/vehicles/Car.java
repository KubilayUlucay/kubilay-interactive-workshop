package homework3;

public class Car extends Vehicle {
    private int numberOfDoors;
	private int numberOfTires;

	public Car(double x, double y) {
        super(x, y);
        this.numberOfDoors = 4;
        this.numberOfTires = 4;
        
    }

	public int getNumberOfDoors() {
		return numberOfDoors;
	}

	public void setNumberOfDoors(int numberOfDoors) {
		this.numberOfDoors = numberOfDoors;
	}

	public int getNumberOfTires() {
		return numberOfTires;
	}

	public void setNumberOfTires(int numberOfTires) {
		this.numberOfTires = numberOfTires;
	}
}
