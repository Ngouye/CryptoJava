package tp4;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Signature;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import tp1.Utils;


public class TestSignature {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        KeyPair kp = kpg.generateKeyPair();
        RSAPrivateKey priv = (RSAPrivateKey) kp.getPrivate();
        RSAPublicKey pub = (RSAPublicKey) kp.getPublic();
        String message = "Bonjour master 2 2026";
        Signature s = Signature.getInstance("RSA");
        s.initSign(priv);
        s.update(message.getBytes());
        byte[] sig = s.sign();
        System.out.println("Signature : " + Utils.toHex(sig));
        s.initVerify(pub);
        s.update(message.getBytes());
        boolean v = s.verify(sig);
        System.out.println("Verification : "+ v);
    }
}
