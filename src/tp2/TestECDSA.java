package tp2;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.ECPrivateKey;
import java.security.interfaces.ECPublicKey;
import java.security.spec.ECPrivateKeySpec;
import java.security.spec.ECPublicKeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.security.spec.ECGenParameterSpec;
import tp1.Utils;

public class TestECDSA {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC");
        kpg.initialize(new ECGenParameterSpec("secp256r1"));
        KeyPair kp = kpg.generateKeyPair();
        ECPrivateKey priv = (ECPrivateKey) kp.getPrivate();
        ECPublicKey pub = (ECPublicKey) kp.getPublic();

        System.out.println("Cle privee ECDSA : " + Utils.toHex(priv.getEncoded()));
        System.out.println("Taille de la cle  : "+pub.getW().getAffineX().bitLength());
        System.out.println("Cle publique ECDSA : " + Utils.toHex(pub.getEncoded()));
        System.out.println("Taille de la cle   : "+pub.getW().getAffineY().bitLength());

        KeyFactory fk = KeyFactory.getInstance("EC");

        // Reconstruction clé publique via ECPublicKeySpec (point W + paramètres de courbe)
        ECPublicKeySpec pubSpec = new ECPublicKeySpec(pub.getW(), pub.getParams());
        ECPublicKey pub1 = (ECPublicKey) fk.generatePublic(pubSpec);

        // Reconstruction clé publique via encodage X509
        X509EncodedKeySpec pubSpec2 = new X509EncodedKeySpec(pub.getEncoded());
        ECPublicKey pub2 = (ECPublicKey) fk.generatePublic(pubSpec2);

        if (pub.equals(pub1) && pub.equals(pub2)) {
            System.out.println("Cles publiques ECDSA identiques");
        } else {
            System.out.println("Cles publiques ECDSA differentes");
        }

        // Reconstruction clé privée via ECPrivateKeySpec (scalaire S + paramètres de courbe)
        ECPrivateKeySpec privSpec = new ECPrivateKeySpec(priv.getS(), priv.getParams());
        ECPrivateKey priv1 = (ECPrivateKey) fk.generatePrivate(privSpec);

        // Reconstruction clé privée via encodage PKCS8
        PKCS8EncodedKeySpec privSpec2 = new PKCS8EncodedKeySpec(priv.getEncoded());
        ECPrivateKey priv2 = (ECPrivateKey) fk.generatePrivate(privSpec2);

        if (priv.equals(priv1) && priv.equals(priv2)) {
            System.out.println("Cles privees ECDSA identiques");
        } else {
            System.out.println("Cles privees ECDSA differentes");
        }
    }
}