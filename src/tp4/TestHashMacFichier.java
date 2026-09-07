package tp4;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.FileInputStream;
import tp1.Utils;

public class TestHashMacFichier {
    public static void main(String[] args) throws Exception {
        FileInputStream cle = new FileInputStream("C://MTDSI//key.txt");
        byte[] cleBytes = cle.readAllBytes();
        cle.close();
        SecretKeySpec sk = new SecretKeySpec(cleBytes, "HmacSHA1");
        Mac m = Mac.getInstance("HmacSHA1");
        m.init(sk);
        FileInputStream message = new FileInputStream("C://MTDSI//message.txt");
        byte[] buffer = new byte[16];
        int nbLus;
        while ((nbLus = message.read(buffer)) != -1) {
            m.update(buffer, 0, nbLus);
        }
        message.close();
        byte[] hash = m.doFinal();
        System.out.println("Message hache avec succes : " + Utils.toHex(hash));
    }
}