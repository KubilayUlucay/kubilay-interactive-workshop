package homework3;

public class Hatchback extends Car  {
    public Hatchback(double x, double y) {
        super(x, y);
    }
    // Additional methods or overrides for HatchbackCar-specific behavior
	public String getColor() {
		return "Black";
	}
	public int getNumberOfDoors() {
		return 5;
	}
}
