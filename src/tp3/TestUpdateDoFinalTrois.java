package tp3;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import tp1.Utils;

public class TestUpdateDoFinalTrois {
    public static void main(String[] args) throws Exception {
        KeyGenerator kg = KeyGenerator.getInstance("AES");
        kg.init(128);
        SecretKey sk = kg.generateKey();
        byte[] p1 = "Bonjour".getBytes();
        byte[] p2 = "je m'apelle Nabil".getBytes();
        byte[] p3 = "je suis un etudiant".getBytes();
        Cipher c = Cipher.getInstance("AES");
        c.init(Cipher.ENCRYPT_MODE, sk);
        int taille = c.getOutputSize(p1.length + p2.length + p3.length);
        byte[] cipherText = new byte[taille];
        int c1 = c.update(p1, 0, p1.length, cipherText);
        int c2 = c.update(p2, 0, p2.length, cipherText, c1);
        int c3 = c.update(p3, 0, p3.length, cipherText, c1 + c2);
        int chiffre = c.doFinal(cipherText, c1 + c2 + c3);
        System.out.println("Chiffré  : " + Utils.toHex(cipherText));
        c.init(Cipher.DECRYPT_MODE, sk);
        byte[] dechiffre = new byte[cipherText.length];
        int m1 = c.update(cipherText, 0, c1, dechiffre);
        int m2 = c.update(cipherText, c1, c2, dechiffre, m1);
        int m3 = c.update(cipherText, c1 + c2, c3, dechiffre, m1 + m2);
        int m4 = c.update(cipherText, c1 + c2 + c3, chiffre, dechiffre, m1 + m2 + m3);
        int m = c.doFinal(dechiffre, m1 + m2 + m3 + m4);
        String resultat = new String(dechiffre, 0, m1 + m2 + m3 + m4 + m);
        System.out.println("Déchiffré : " + resultat);
    }
    
}