package tp3;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;


public class TestPBECipher {
    public static void main(String[] args) throws Exception {
        char [] pwd = "master TDSI".toCharArray();
        byte [] salt = "TDSI2026".getBytes();
        int iter = 10;
        PBEKeySpec pbe = new PBEKeySpec(pwd, salt, iter);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBEWithSHA256AND128BITAES-CBC-BC") ;
        SecretKey sk = skf.generateSecret(pbe);
        Cipher c = Cipher.getInstance("PBEWithSHA256AND128BITAES-CBC-BC");
        c.init(Cipher.ENCRYPT_MODE, sk);
        String message = "Salut MTDSI";
        byte [] chiffre = c.doFinal(message.getBytes());
        System.out.println("Chiffre : "+new String(chiffre));
        c.init(Cipher.DECRYPT_MODE, sk);
        byte [] dechiffre = c.doFinal(chiffre);
        System.out.println("Dechiffre : "+new String(dechiffre));
    }
}
