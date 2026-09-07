package tp3;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;


public class TestCipherInputStream {
    public static void main(String[] args) throws Exception {
        FileInputStream fis = new FileInputStream("C://MTDSI//message.txt");
        FileOutputStream fos = new FileOutputStream("C://MTDSI//chiffre.txt");
        KeyGenerator kg = KeyGenerator.getInstance("AES");
        kg.init(128);
        SecretKey sk = kg.generateKey();
        Cipher c = Cipher.getInstance("AES");
        c.init(Cipher.ENCRYPT_MODE, sk);
        CipherInputStream cis = new CipherInputStream(fis,c);
        byte [] tab = new byte[16];
        while (cis.read(tab)!=-1) {            
            fos.write(tab);
            
        }
        fis.close();
        fos.close();
        System.out.println("Donnee bien chiffree");
        FileInputStream fis2 = new FileInputStream("C://MTDSI//chiffre.txt");
        FileOutputStream fos2 = new FileOutputStream("C://MTDSI//dechiffre.txt");
        c.init(Cipher.DECRYPT_MODE, sk);
        CipherInputStream cis2 = new CipherInputStream(fis2, c);
        byte [] tab2 = new byte[16];
        while (cis2.read(tab2) != -1) {            
            fos2.write(tab2);
        }
        fis2.close();
        fos2.close();
        System.out.println("Donnee bien dechiffree.");
        
    }
}
