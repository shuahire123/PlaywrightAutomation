import java.io.*;
import java.util.*;

public class contact {

    public static void main(String[] args) {

        String inputFile = "C:\\Users\\shuah\\OneDrive\\Desktop\\cs_1771386643887.csv";      // your csv
        String outputFile = "C:\\Users\\shuah\\OneDrive\\Desktop\\UniqueNumbers.txt";      // notepad output

        Set<String> numbers = new LinkedHashSet<>();

        try (BufferedReader br = new BufferedReader(new FileReader(inputFile))) {

            String line;

            while ((line = br.readLine()) != null) {

                // split using TAB (important)
                String[] columns = line.split("\\t");

                for (String col : columns) {

                    // keep only digits
                    String num = col.replaceAll("[^0-9]", "");

                    // remove 91 prefix
                    if (num.startsWith("91") && num.length() > 10)
                        num = num.substring(num.length() - 10);

                    // valid Indian mobile
                    if (num.matches("[6-9][0-9]{9}")) {
                        numbers.add(num);
                    }
                }
            }

            BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile));

            for (String n : numbers) {
                writer.write(n);
                writer.newLine();
            }

            writer.close();

            System.out.println("Done ✔ Numbers saved in Numbers.txt");
            System.out.println("Total unique numbers: " + numbers.size());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
