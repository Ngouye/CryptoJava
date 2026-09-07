
package tp3;

import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class TestWrapAsymToSym {
    public static void main(String[] args) throws Exception {
         KeyGenerator kg = KeyGenerator.getInstance("AES");
        kg.init(128);
        SecretKey sk = kg.generateKey();
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        KeyPair kp = kpg.generateKeyPair();
        RSAPublicKey pub1 = (RSAPublicKey) kp.getPublic();
        RSAPrivateKey priv1 = (RSAPrivateKey) kp.getPrivate();
        Cipher c = Cipher.getInstance("RSA");
        c.init(Cipher.WRAP_MODE, pub1);
        byte [] cleWrap = c.wrap(sk);
        c.init(Cipher.UNWRAP_MODE, priv1);
        Key k = c.unwrap(cleWrap, "AES", Cipher.SECRET_KEY);
        if (sk.equals(k)) {
            System.out.println("Cle identiques");
        } else {
            System.out.println("Cle differentes");
        }
    }
}
