package tp_crypto;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.security.Signature;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import tp1.Utils;



public class SystemeAsymetrique {
    public static void genKeyRSA(String prov,int taille)throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA",prov);
        kpg.initialize(taille, new SecureRandom());
        KeyPair kp = kpg.generateKeyPair();
        RSAPublicKey pub = (RSAPublicKey)kp.getPublic();
        RSAPrivateKey priv = (RSAPrivateKey)kp.getPrivate();
        saveKey(pub,"pubKey.txt");
        saveKey(priv,"privKey.txt");
    }
    
    public static void saveKey(Key k, String fichier)throws Exception {
        FileOutputStream fos = new FileOutputStream("C:\\MTDSI\\"+fichier);
        if (k.getFormat().equalsIgnoreCase("X.509")) {
            fos.write(k.getEncoded());
        }
        if (k.getFormat().equalsIgnoreCase("PKCS#8")) {
            fos.write(k.getEncoded());
        }
        fos.close();
        System.out.println("Cle "+k.getFormat()+" enregistrée");
    }
    
    public static RSAPublicKey getPubRSA(String fichier)throws Exception{
        FileInputStream fis = new FileInputStream("C:\\MTDSI\\"+fichier);
        byte [] b = new byte[fis.available()];
        fis.read(b);
        X509EncodedKeySpec x509 = new X509EncodedKeySpec(b);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        RSAPublicKey pub = (RSAPublicKey)kf.generatePublic(x509);
        return pub;
    }
    
    public static RSAPrivateKey getPrivRSA(String fichier)throws Exception {
        FileInputStream fis = new FileInputStream("C:\\MTDSI\\"+fichier);
        byte [] b = new byte [fis.available()];
        fis.read(b);
        PKCS8EncodedKeySpec pkcs8 = new PKCS8EncodedKeySpec(b);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        RSAPrivateKey priv = (RSAPrivateKey)kf.generatePrivate(pkcs8);
        return priv;
    } 
    
    public static void crypt(RSAPublicKey pub,String in, String out) throws Exception {
        FileInputStream fis = new FileInputStream("C://MTDSI//"+in);
        FileOutputStream fos = new FileOutputStream("C://MTDSI//"+out);
        Cipher c = Cipher.getInstance("RSA");
        c.init(Cipher.ENCRYPT_MODE, pub);
        CipherInputStream cis = new CipherInputStream(fis, c);
        byte [] tab = new byte[16];
        int nbByteLu = cis.read(tab);
        while (nbByteLu !=-1) {            
            fos.write(tab);
            nbByteLu = cis.read(tab);
        }
        fis.close();
        fos.close();
        System.out.println("Donnees bien chifrees");
    }
    
    public static void decrypt(RSAPrivateKey priv,String in, String out) throws Exception {
        FileInputStream fis = new FileInputStream("C://MTDSI//"+in);
        FileOutputStream fos = new FileOutputStream("C://MTDSI//"+out);
        Cipher c = Cipher.getInstance("RSA");
        c.init(Cipher.DECRYPT_MODE, priv);
        CipherInputStream cis = new CipherInputStream(fis, c);
        byte [] tab = new byte[16];
        int nbByteLu = cis.read(tab);
        while (nbByteLu !=-1) {            
            fos.write(tab);
            nbByteLu = cis.read(tab);
        }
        fis.close();
        fos.close();
        System.out.println("Donnees bien dechifrees");
    }
    
    public static void sig(RSAPrivateKey priv,String in, String out) throws Exception {
        FileInputStream fis = new FileInputStream("C://MTDSI//"+in);
        FileOutputStream fos = new FileOutputStream("C://MTDSI//"+out);
        byte[] input = new byte[fis.available()];
        fis.read(input);
        MessageDigest md = MessageDigest.getInstance("SHA256");
        md.update(input);
        byte[] h = md.digest();
        Signature s = Signature.getInstance("RSA");
        s.initSign(priv);
        s.update(h);
        byte[] sig = s.sign();
        fos.write(sig);
        fis.close();
        fos.close();
        System.out.println("Signature terminee.");
    }
    
    public static void verif(RSAPublicKey pub, String mess, String sign) throws Exception {
        FileInputStream fis_mess = new FileInputStream("C://MTDSI//"+mess);
        FileInputStream fis_sign = new FileInputStream("C://MTDSI//"+sign);        
        MessageDigest md = MessageDigest.getInstance("SHA256");
        byte[] input1 = new byte[fis_mess.available()];
        fis_mess.read(input1);
        md.update(input1);
        byte[] input2 = new byte[fis_sign.available()];
        fis_sign.read(input2);
        fis_mess.close();
        fis_sign.close();
        byte[] h = md.digest();
        Signature s = Signature.getInstance("RSA");
        s.initVerify(pub);
        s.update(h);
        boolean v = s.verify(input2);
        if (v == true) {
            System.out.println("Signature valide.");
        } else {
            System.out.println("Signature no valide.");
        }
    }
    
    public static void main(String[] args) throws Exception {
        //SystemeAsymetrique.genKeyRSA("BC", 2048);
        RSAPublicKey clePub = SystemeAsymetrique.getPubRSA("pubKey.txt");
        RSAPrivateKey clePriv = SystemeAsymetrique.getPrivRSA("privKey.txt");
        
//        System.out.println("Cle prive : "+Utils.toHex(clePriv.getEncoded())+""
//                + "\n Cle public : "+Utils.toHex(clePub.getEncoded()));
        
        //SystemeAsymetrique.crypt(clePub, "message.txt", "chiffreRSA.txt");
        //SystemeAsymetrique.decrypt(clePriv, "chiffreRSA.txt", "dechiffreRSA.txt");
        
        //SystemeAsymetrique.sig(clePriv, "message.txt", "signature.txt");
        
        SystemeAsymetrique.verif(clePub, "message.txt", "signature.txt");

    }
}
