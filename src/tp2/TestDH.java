package tp2;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import javax.crypto.interfaces.DHPrivateKey;
import javax.crypto.interfaces.DHPublicKey;
import javax.crypto.spec.DHPrivateKeySpec;
import javax.crypto.spec.DHPublicKeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import tp1.Utils;

public class TestDH {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("DH");
        kpg.initialize(1024);
        KeyPair kp = kpg.generateKeyPair();
        DHPrivateKey priv = (DHPrivateKey) kp.getPrivate();
        DHPublicKey pub = (DHPublicKey) kp.getPublic();

        System.out.println("Cle privee DH : " + Utils.toHex(priv.getEncoded()));
        System.out.println("Cle publique DH : " + Utils.toHex(pub.getEncoded()));

        KeyFactory fk = KeyFactory.getInstance("DH");

        // Reconstruction clé publique via DHPublicKeySpec (Y, P, G)
        DHPublicKeySpec pubSpec = new DHPublicKeySpec(
                pub.getY(),
                pub.getParams().getP(),
                pub.getParams().getG());
        DHPublicKey pub1 = (DHPublicKey) fk.generatePublic(pubSpec);

        // Reconstruction clé publique via encodage X509
        X509EncodedKeySpec pubSpec2 = new X509EncodedKeySpec(pub.getEncoded());
        DHPublicKey pub2 = (DHPublicKey) fk.generatePublic(pubSpec2);

        if (pub.equals(pub1) && pub.equals(pub2)) {
            System.out.println("Cles publiques DH identiques");
        } else {
            System.out.println("Cles publiques DH differentes");
        }

        // Reconstruction clé privée via DHPrivateKeySpec (X, P, G)
        DHPrivateKeySpec privSpec = new DHPrivateKeySpec(
                priv.getX(),
                priv.getParams().getP(),
                priv.getParams().getG());
        DHPrivateKey priv1 = (DHPrivateKey) fk.generatePrivate(privSpec);

        // Reconstruction clé privée via encodage PKCS8
        PKCS8EncodedKeySpec privSpec2 = new PKCS8EncodedKeySpec(priv.getEncoded());
        DHPrivateKey priv2 = (DHPrivateKey) fk.generatePrivate(privSpec2);

        if (priv.equals(priv1) && priv.equals(priv2)) {
            System.out.println("Cles privees DH identiques");
        } else {
            System.out.println("Cles privees DH differentes");
        }
    }
}