package tp4;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import tp1.Utils;


public class TestDigestInputStream {
    public static void main(String[] args) throws Exception {
        FileInputStream fis = new FileInputStream("C://MTDSI//message.txt");
        FileOutputStream fos = new FileOutputStream("C://MTDSI//hash.txt");
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        DigestInputStream dis = new DigestInputStream(fis, md);
        byte [] d = new byte[16];
        byte [] emp = null;
        while (dis.read(d)!=-1) { 
            emp = md.digest();
            fos.write(Utils.toHex(emp).getBytes()); 
        }
        fis.close();
        fos.close();
        System.out.println("Hashage termine : "+Utils.toHex(emp));
        
    }
}
