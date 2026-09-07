package tp2;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import tp1.Utils;

public class TestRSA {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        KeyPair kp = kpg.generateKeyPair();
        RSAPrivateKey priv = (RSAPrivateKey) kp.getPrivate();
        RSAPublicKey pub = (RSAPublicKey) kp.getPublic();

        System.out.println("Cle privee RSA : " + Utils.toHex(priv.getEncoded()));
        System.out.println("Cle publique RSA : " + Utils.toHex(pub.getEncoded()));

        KeyFactory fk = KeyFactory.getInstance("RSA");

        // Reconstruction clé publique via RSAPublicKeySpec (modulus + exposant public)
        RSAPublicKeySpec pubSpec = new RSAPublicKeySpec(pub.getModulus(), pub.getPublicExponent());
        RSAPublicKey pub1 = (RSAPublicKey) fk.generatePublic(pubSpec);

        // Reconstruction clé publique via encodage X509
        X509EncodedKeySpec pubSpec2 = new X509EncodedKeySpec(pub.getEncoded());
        RSAPublicKey pub2 = (RSAPublicKey) fk.generatePublic(pubSpec2);

        if (pub.equals(pub1) && pub.equals(pub2)) {
            System.out.println("Cles publiques RSA identiques");
        } else {
            System.out.println("Cles publiques RSA differentes");
        }

        // Reconstruction clé privée via RSAPrivateKeySpec (modulus + exposant privé)
        RSAPrivateKeySpec privSpec = 
                new RSAPrivateKeySpec(priv.getModulus(),priv.getPrivateExponent());
        RSAPrivateKey priv1 = (RSAPrivateKey) fk.generatePrivate(privSpec);

        // Reconstruction clé privée via encodage PKCS8
        PKCS8EncodedKeySpec privSpec2 = new PKCS8EncodedKeySpec(priv.getEncoded());
        RSAPrivateKey priv2 = (RSAPrivateKey) fk.generatePrivate(privSpec2);

        if (priv.equals(priv1) && priv.equals(priv2)) {
            System.out.println("Cles privees RSA identiques");
        } else {
            System.out.println("Cles privees RSA differentes");
        }
    }
}