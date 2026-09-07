package tp2;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import javax.crypto.KeyAgreement;
import tp1.Utils;


public class TestKeyAgreement {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("DH");
        kpg.initialize(1024);
        KeyPair kpA = kpg.generateKeyPair();
        KeyPair kpB = kpg.generateKeyPair();
        KeyAgreement kaA = KeyAgreement.getInstance("DH");
        KeyAgreement kaB = KeyAgreement.getInstance("DH");
        kaA.init(kpA.getPrivate());
        kaB.init(kpB.getPrivate());
        kaA.doPhase(kpB.getPublic(), true);
        kaB.doPhase(kpA.getPublic(), true);
        byte [] skA = kaA.generateSecret();
        byte [] skB = kaB.generateSecret();
        System.out.println("Cle A : "+Utils.toHex(skA)); 
        System.out.println("Cle B : "+Utils.toHex(skB));
    }
}
