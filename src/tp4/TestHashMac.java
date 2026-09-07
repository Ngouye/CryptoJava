package tp4;

import javax.crypto.KeyGenerator;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import tp1.Utils;


public class TestHashMac {
    public static void main(String[] args) throws Exception {
        KeyGenerator kg = KeyGenerator.getInstance("AES");
        SecretKey sk = kg.generateKey();
        Mac m = Mac.getInstance("HmacSHA1");
        m.init(sk);
        String message = "on veut hasher ce message.";
        m.update(message.getBytes());
        byte[] hash = m.doFinal();
        System.out.println("Message hache avec succes : "+Utils.toHex(hash));
    }
}
