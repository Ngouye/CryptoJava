package tp4;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.Signature;
import tp1.Utils;


public class TestSignWithHash {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("DSA");
        kpg.initialize(1024);
        KeyPair kp = kpg.generateKeyPair();
        String m = "Test signature avec hachage";
        MessageDigest md = MessageDigest.getInstance("SHA256");
        md.update(m.getBytes());
        byte[] h = md.digest();
        Signature s = Signature.getInstance("DSA");
        s.initSign(kp.getPrivate());
        s.update(h);
        byte[] sig = s.sign();
        System.out.println("Signature : " + Utils.toHex(sig));
        s.initVerify(kp.getPublic());
        s.update(h);
        boolean v = s.verify(sig);
        System.out.println("Verification : " + v);
        
    }
}
