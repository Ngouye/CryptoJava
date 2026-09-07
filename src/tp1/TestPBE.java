package tp1;

import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class TestPBE {
    public static void main(String[] args) throws Exception {
        char [] pwd = "passer".toCharArray();
        byte [] salt = "master".getBytes();
        int iter = 10;
        
        PBEKeySpec pbe = new PBEKeySpec(pwd, salt, iter);
        SecretKeyFactory skf = 
                SecretKeyFactory.getInstance("PBEWITHSHAAND128BITAES-CBC-BC");
        SecretKey sk = skf.generateSecret(pbe);
        System.out.println("cle PBE : "+Utils.toHex(sk.getEncoded()));
    }
}
