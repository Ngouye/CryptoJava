package tp3;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;


public class TestUpdateDoFinal {
    public static void main(String[] args) throws Exception {
        KeyGenerator kg = KeyGenerator.getInstance("AES");
        kg.init(128);
        SecretKey sk = kg.generateKey();
        byte [] p1 = "Salut m2tdsi".getBytes();
        byte [] p2 = "Bonjour mcs".getBytes();
        Cipher c = Cipher.getInstance("AES");
        c.init(Cipher.ENCRYPT_MODE, sk);
        int taille = c.getOutputSize(p1.length + p2.length);
        byte [] cipherText = new byte[taille];
        int c1 = c.update(p1, 0, p1.length, cipherText);
        int c2 = c.update(p2, 0, p2.length, cipherText, c1);
        int chiffre = c.doFinal(cipherText, c1 + c2);
        System.out.println("Chiffre : "+ new String(cipherText));
        c.init(Cipher.DECRYPT_MODE, sk);
        byte [] dechiffre = new byte[taille];
        int m1 = c.update(cipherText, 0, c1, dechiffre);
        int m2 = c.update(cipherText, m1, cipherText.length, dechiffre, m1);
        int m = c.doFinal(dechiffre, m1 + m2);
        //dechiffre = c.doFinal(cipherText,0,cipherText.length);
        System.out.println("Dechiffre : "+new String(dechiffre));
        
    }
}
