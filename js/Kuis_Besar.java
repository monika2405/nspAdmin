import java.util.ArrayList;
import java.util.Scanner;
public class Kuis_Besar{

    public static void main(String[] args) {
        ArrayList<String> listSubs = new ArrayList<>();
        Scanner sc = new Scanner(System.in);
        String kalimat = sc.nextLine();
        int input = sc.nextInt();
        for (int i = 0; i<input; ++i){
            String substr = sc.next();
            listSubs.add(substr);
        }
        for (int i=0; i<listSubs.size();++i){
            if(kalimat.contains(listSubs.get(i))){
                System.out.println("Y");
            }else{
                System.out.println("N");
            }
        }
    }
}