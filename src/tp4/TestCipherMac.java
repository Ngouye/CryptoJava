package tp4;

import javax.crypto.KeyGenerator;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import tp1.Utils;

public class TestCipherMac {
    public static void main(String[] args) throws Exception {
        KeyGenerator kg = KeyGenerator.getInstance("DES");
        SecretKey sk = kg.generateKey();
        Mac m = Mac.getInstance("DES");
        m.init(sk);
        String message = "Bonjour tout le monde !";
        m.update(message.getBytes());
        byte [] hash = m.doFinal();
        System.out.println("Empreinte : "+Utils.toHex(hash));
    }
}
