package tp_crypto;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import tp1.Utils;

public class SystemeSymetrique {
    public static void genKey(String algo, String prov, int taille)throws Exception{
        KeyGenerator kg = KeyGenerator.getInstance(algo, prov);
        kg.init(taille);
        SecretKey sk = kg.generateKey();
        saveKey(sk,"key.txt");
    }
    
    public static void saveKey(SecretKey sk, String fichier)throws Exception {
        FileOutputStream fos = new FileOutputStream("C://MTDSI//"+fichier);
        ObjectOutputStream oos = new ObjectOutputStream(fos);
        oos.writeObject(sk);
        oos.close();
        System.out.println("Cle bien enregistre");
    }
    
    public static SecretKey getKey(String fichier) throws Exception {
        FileInputStream fis = new FileInputStream("C://MTDSI//"+fichier);
        ObjectInputStream ois = new ObjectInputStream(fis);
        SecretKey sk = (SecretKey)ois.readObject();
        ois.close();
        return sk;
    }
    
    public static  void crypt(String algo, SecretKey sk, String in, String out) throws Exception {
        FileInputStream fis = new FileInputStream("C://MTDSI//"+in);
        FileOutputStream fos = new FileOutputStream("C://MTDSI//"+out);
        Cipher c = Cipher.getInstance(algo);
        c.init(Cipher.ENCRYPT_MODE, sk);
        CipherInputStream cis = new CipherInputStream(fis,c);
        byte [] tab = new byte[8];
        int nbByteLu = cis.read(tab);
        while (nbByteLu!=-1) {            
            fos.write(tab);
            nbByteLu = cis.read(tab);
        }
        fis.close();
        fos.close();
        System.out.println("Fin chiffrement, donnees enregistrees");
        
        
    }
    
    public static  void decrypt(String algo,SecretKey sk, String in, String out) throws Exception {
        FileInputStream fis = new FileInputStream("C://MTDSI//"+in);
        FileOutputStream fos = new FileOutputStream("C://MTDSI//"+out);
        Cipher c = Cipher.getInstance(algo);
        c.init(Cipher.DECRYPT_MODE, sk);
        CipherInputStream cis = new CipherInputStream(fis,c);
        byte [] tab = new byte[8];
        int nbByteLu = cis.read(tab);
        while (nbByteLu!=-1) {            
            fos.write(tab);
            nbByteLu = cis.read(tab);
        }
        fis.close();
        fos.close();
        System.out.println("Fin dechiffrement, donnees enregistrees");
    }
    
    public static void main(String[] args) throws Exception {
       // SystemeSymetrique.genKey("AES", "BC", 128);
       SecretKey sk = SystemeSymetrique.getKey("key.txt");
//        System.out.println("cle :"+Utils.toHex(sk.getEncoded())+"\n algo : "
//                +sk.getAlgorithm()+"\n taille : "+sk.getEncoded().length * 8);
        //SystemeSymetrique.crypt("AES", sk, "message.txt", "chiffre.txt");
        SystemeSymetrique.decrypt("AES", sk, "chiffre.txt", "dechiffre.txt");
    } 
}
