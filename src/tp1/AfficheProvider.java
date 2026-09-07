package tp1;

import java.security.*;

public class AfficheProvider {
    public static void main(String[] args) {
        //BouncyCastleProvider bc = new BouncyCastleProvider();
        //Security.addProvider(bc);
        //Security.insertProviderAt(bc, 3);
         Provider []p = Security.getProviders();
        System.out.println("Nombre de Providers: "+p.length);
        for (Provider p1 : p) {

            System.out.println(p1.getName());
        }

      //  System.out.println(p[0].getInfo());
    
    }
}
