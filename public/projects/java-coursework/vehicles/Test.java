package homework3;
public class Test {

    public static void main(String[] args) {
        // Testing the classes
        // Create a regular car
        Car regularCar = new Car(10, 20);
        regularCar.moveBy(30, 40);
        System.out.println("Regular Car Color: " + regularCar.getColor());
        System.out.println("Regular Car Number of Doors: " + regularCar.getNumberOfDoors());
        System.out.println("Regular Car Number of Tires: " + regularCar.getNumberOfTires());

        // Create a sports car
        SportsCar sportsCar = new SportsCar(5, 5);
        sportsCar.moveBy(15, 25);
        System.out.println("Sports Car Color: " + sportsCar.getColor());
        System.out.println("Sports Car Number of Doors: " + sportsCar.getNumberOfDoors());
        System.out.println("Sports Car Number of Tires: " + sportsCar.getNumberOfTires());

        // Create a hatchback car
        Hatchback hatchbackCar = new Hatchback(30, 10);
        hatchbackCar.moveBy(20, 30);
        System.out.println("Hatchback Car Color: " + hatchbackCar.getColor());
        System.out.println("Hatchback Car Number of Doors: " + hatchbackCar.getNumberOfDoors());
        System.out.println("Hatchback Car Number of Tires: " + hatchbackCar.getNumberOfTires());

        // toString method are not specified on the question. Not implemented.
        // toString could be implemented easily but there is no specific request on the question.
    }
}

