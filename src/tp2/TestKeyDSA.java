package tp2;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.DSAPrivateKey;
import java.security.interfaces.DSAPublicKey;
import java.security.spec.DSAPrivateKeySpec;
import java.security.spec.DSAPublicKeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;


public class TestKeyDSA {
    public static void main(String[] args)throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("DSA");
        kpg.initialize(1024);
        KeyPair kp = kpg.generateKeyPair();
        DSAPublicKey pubDSA = (DSAPublicKey) kp.getPublic();
        DSAPrivateKey privDSA = (DSAPrivateKey) kp.getPrivate();
        DSAPublicKeySpec pubSpec = new DSAPublicKeySpec(pubDSA.getY(),
                pubDSA.getParams().getP(), pubDSA.getParams().getQ(),
                pubDSA.getParams().getG());
        KeyFactory kf = KeyFactory.getInstance("DSA");
        DSAPublicKey pubDSA2 = (DSAPublicKey) kf.generatePublic(pubSpec);
        
        DSAPrivateKeySpec privSpec = new DSAPrivateKeySpec(privDSA.getX(),
                privDSA.getParams().getP(), privDSA.getParams().getQ(),
                privDSA.getParams().getG());
        DSAPrivateKey privDSA2 = (DSAPrivateKey) kf.generatePrivate(privSpec);
       
        X509EncodedKeySpec pubSpec2 = new X509EncodedKeySpec(pubDSA.getEncoded());
        DSAPublicKey pubDSA3 = (DSAPublicKey) kf.generatePublic(pubSpec2);
        if (pubDSA.equals(pubDSA2) && pubDSA.equals(pubDSA3)) {
            System.out.println("Cles publiques DSA identiques");
        } else {
            System.out.println("Cles publiques DSA non identiques");
        }
        PKCS8EncodedKeySpec privSpec2 = new PKCS8EncodedKeySpec(privDSA.getEncoded());
        DSAPrivateKey privDSA3 = (DSAPrivateKey) kf.generatePrivate(privSpec2);
         if (privDSA.equals(privDSA2) && privDSA.equals(privDSA3)) {
            System.out.println("Cles privees DSA identiques");
        } else{
            System.out.println("Cles privees DSA differentes");
        }
        
        
    }
}
