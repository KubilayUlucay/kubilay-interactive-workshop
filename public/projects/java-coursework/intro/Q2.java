package Homework1;

public class Q2 {

	public static void main(String[] args) {
		int RowNumber=8;
		  for (int i = 1; i <= RowNumber; i++) {
	            // Baştaki boşluklar
	            for (int j = 1; j <= RowNumber - i; j++) {
	                System.out.print("  ");
	            }

	            // 1 -> 3^n
	            for (int j = 0; j < i; j++) {
	                int number = (int) Math.pow(3, j);
	                System.out.print(number + " ");
	            }

	            // 3^n -> 1 
	            for (int j = i - 2; j >= 0; j--) {
	                int number = (int) Math.pow(3, j);
	                System.out.print(number + " ");
	            }

	            System.out.println(); // Move to the next line
	        }
	    }
	}