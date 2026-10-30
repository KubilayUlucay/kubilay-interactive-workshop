package Homework1;

import java.util.Locale;
import java.util.Scanner;

public class Q1 {
	public static void main(String[] args) {
		Locale.setDefault(Locale.US); //Input olarak 30.1 verdiğimde hata veriyordu. Bunu da düzeltmek için bunu yapmam gerekiyormuş.
		Scanner input = new Scanner(System.in);
		System.out.println("Please enter the weight of shipment.");
		double weight = input.nextDouble();
		if(weight<=2)
			System.out.println("Cost of transportation is 60 TL for "+ weight+" kilograms");
		if(2<weight && weight<=5)
			System.out.println("Cost of transportation is 100 TL for "+ weight+" kilograms");
		if(5<weight && weight<=15)
			System.out.println("Cost of transportation is 150 TL for "+ weight+" kilograms");
		if(15<weight && weight<=30)
			System.out.println("Cost of transportation is 200 TL for "+ weight+" kilograms");
		else
			System.out.println(weight+" kilograms can not be shipped");
	}
}
