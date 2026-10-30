package homework3;

public class Vehicle {
	    private double x;
	    private double y;
	    private String color;

	    public Vehicle(double x, double y) {
	        this.x = x;
	        this.y = y;
	        this.color = "white";
	    }

	    public void moveBy(double deltaX, double deltaY) {
	        x += deltaX;
	        y += deltaY;
	        System.out.println("Vehicle moved to x=" + x + ", y=" + y);
	    }
	    // Getter and Setter methods for other attributes as needed
		public double getX() {
			return x;
		}

		public void setX(double x) {
			this.x = x;
		}

		public double getY() {
			return y;
		}

		public void setY(double y) {
			this.y = y;
		}

		public String getColor() {
			return color;
		}

		public void setColor(String color) {
			this.color = color;
		} 
}
