package tp1;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;


public class TestSecretKey {
    public static void main(String[] args) throws Exception{
        KeyGenerator kg = KeyGenerator.getInstance("AES","BC");
        kg.init(256);
        SecretKey sk = kg.generateKey();
        System.out.println("Valeur cle: "+Utils.toHex(sk.getEncoded()));
        System.out.println("Algo cle: "+sk.getAlgorithm());
        System.out.println("Format cle: "+sk.getFormat());
        ObjectOutputStream oos = 
                new ObjectOutputStream(new FileOutputStream("C://MTDSI//key.txt"));
        oos.writeObject(sk);
        oos.close();
        ObjectInputStream ois = new ObjectInputStream (new FileInputStream("C://MTDSI//key.txt"));
        //byte[] b = new byte(oos.available());
        SecretKey sk2  = (SecretKey) ois.readObject();
        //SecretKeyFactory skf =  SecretKeyFactory.getInstance("AES");
        //SecretKey sk2 = skf.generateSecret(cle);
        ois.close();
        if (sk.equals(sk2)) System.out.println("Cles identiques");
        else System.out.println("Cles differentes ");
    }
}
