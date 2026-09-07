package tp4;

import java.security.MessageDigest;
import tp1.Utils;


public class TestMessageDigest {
    public static void main(String[] args) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        String m = "Bonjour m2tdsi";
        //md.update(m.getBytes());
        byte [] hash = md.digest(m.getBytes());
        System.out.println("Empreinte : "+Utils.toHex(hash));
        System.out.println("Algo : "+md.getAlgorithm());
        System.out.println("Taille empreinte : "+hash.length*8);
        System.out.println("Taille : "+md.getDigestLength() * 8);
    }
}
