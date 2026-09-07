package tp2;

import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Arrays;
import javax.crypto.KeyAgreement;
import tp1.Utils;

public class TestAgreementn {
    public static void main(String[] args) throws Exception {
        int n = 10; 
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("DH");
        kpg.initialize(1024);
        KeyPair[] kp = new KeyPair[n];
        for (int i = 0; i < n; i++) {
            kp[i] = kpg.generateKeyPair();
        }
        KeyAgreement[] ka = new KeyAgreement[n];
        for (int i = 0; i < n; i++) {
            ka[i] = KeyAgreement.getInstance("DH");
            ka[i].init(kp[i].getPrivate());
        }
        Key[] current = new Key[n];
        for (int i = 0; i < n; i++) {
            current[i] = ka[i].doPhase(kp[(i - 1 + n) % n].getPublic(), false);
        }
        for (int tour = 2; tour <= n - 2; tour++) {
            Key[] next = new Key[n];
            for (int i = 0; i < n; i++) {
                next[i] = ka[i].doPhase(current[(i - 1 + n) % n], false);
            }
            current = next;
        }
        for (int i = 0; i < n; i++) {
            ka[i].doPhase(current[(i - 1 + n) % n], true);
        }
        byte[][] secrets = new byte[n][];
        for (int i = 0; i < n; i++) {
            secrets[i] = ka[i].generateSecret();
            System.out.println("Secret de P" + i + " : " + Utils.toHex(secrets[i]));
        }
        boolean identiques = true;
        for (int i = 1; i < n; i++) {
            if (!Arrays.equals(secrets[0], secrets[i])) {
                identiques = false;
                break;
            }
        }
        if (identiques) {
            System.out.println("Secrets identiques");
        } else {
            System.out.println("Secrets différents");
        }
    }
}