package tp3;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;


public class TestWrapSymToAsym {
    public static void main(String[] args) throws Exception {
        KeyGenerator kg = KeyGenerator.getInstance("AES");
        kg.init(128);
        SecretKey sk = kg.generateKey();
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        KeyPair kp = kpg.generateKeyPair();
        RSAPublicKey pub1 = (RSAPublicKey) kp.getPublic();
        RSAPrivateKey priv1 = (RSAPrivateKey) kp.getPrivate();
        Cipher c = Cipher.getInstance("AES");
        c.init(Cipher.WRAP_MODE, sk);
        byte [] pubChiffre = c.wrap(pub1);
        byte [] privChiffre = c.wrap(priv1);
        c.init(Cipher.UNWRAP_MODE, sk);
        RSAPublicKey pub2 = 
                (RSAPublicKey) c.unwrap(pubChiffre, "RSA", Cipher.PUBLIC_KEY);
        if (pub1.equals(pub2)) {
            System.out.println("Cle publique identique");
        } else {
            System.out.println("Cle publique differentes");
        }
        
        RSAPrivateKey priv2 = 
               (RSAPrivateKey) c.unwrap(privChiffre, "RSA", Cipher.PRIVATE_KEY);
        if (priv1.equals(priv2)) {
            System.out.println("Cle privees identique");
       } else {
           System.out.println("Cle privees differentes");
       }
    }
}
