package tp3;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;


public class TestCipher {
    public static void main(String[] args) throws Exception {
        KeyGenerator kg = KeyGenerator.getInstance("AES");
        kg.init(128);
        SecretKey sk = kg.generateKey();
        String m = "Bonjour tout le monde.";
        Cipher c = Cipher.getInstance("AES");
        c.init(Cipher.ENCRYPT_MODE, sk);
        byte [] chiffre = c.doFinal(m.getBytes());
        System.out.println("Chiffre = "+new String(chiffre));
        c.init(Cipher.DECRYPT_MODE, sk);
        byte [] dechiffre = c.doFinal(chiffre);
        System.out.println("Dechiffre = "+ new String(dechiffre));
    }
}
