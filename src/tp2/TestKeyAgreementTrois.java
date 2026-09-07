package tp2;

import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Arrays;
import javax.crypto.KeyAgreement;
import tp1.Utils;



public class TestKeyAgreementTrois {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("DH");
        kpg.initialize(1024);
        KeyPair kpA = kpg.generateKeyPair();
        KeyPair kpB = kpg.generateKeyPair();
        KeyPair kpC = kpg.generateKeyPair();
        KeyAgreement kaA = KeyAgreement.getInstance("DH");
        KeyAgreement kaB = KeyAgreement.getInstance("DH");
        KeyAgreement kaC = KeyAgreement.getInstance("DH");
        kaA.init(kpA.getPrivate());
        kaB.init(kpB.getPrivate());
        kaC.init(kpC.getPrivate());
        //Premier tour
        Key AB = kaB.doPhase(kpA.getPublic(), false);
        Key BC = kaC.doPhase(kpB.getPublic(), false);
        Key CA = kaA.doPhase(kpC.getPublic(), false);
        //Deuxieme tour
        kaA.doPhase(BC, true);
        kaB.doPhase(CA, true);
        kaC.doPhase(AB, true);
        //Generation du secret partage
        byte [] skA = kaA.generateSecret();
        System.out.println("Secret de A : "+Utils.toHex(skA));
        byte [] skB = kaB.generateSecret();
        System.out.println("Secret de B : "+Utils.toHex(skB));
        byte [] skC = kaC.generateSecret();
        System.out.println("Secret de C : "+Utils.toHex(skC));
        if (Arrays.equals(skA,skB) && Arrays.equals(skA,skC ) ) {
            System.out.println("Secret identiques");
        } else {
            System.out.println("Secret differents");
        }
        
        
        
    }
}
