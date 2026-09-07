package sn.ucad.tdsi.crypto.service;

import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

@Component
public class CryptoUtils {

    private static final String DIGITS = "0123456789abcdef";

    /**
     * Convertit un tableau d'octets en chaîne hexadécimale (issu du TP1)
     */
    public static String toHex(byte[] data, int length) {
        if (data == null) return "";
        StringBuilder buf = new StringBuilder();
        for (int i = 0; i != length; i++) {
            int v = data[i] & 0xff;
            buf.append(DIGITS.charAt(v >> 4));
            buf.append(DIGITS.charAt(v & 0xf));
        }
        return buf.toString();
    }

    public static String toHex(byte[] data) {
        if (data == null) return "";
        return toHex(data, data.length);
    }

    /**
     * Convertit une chaîne hexadécimale en tableau d'octets
     */
    public static byte[] fromHex(String hex) {
        if (hex == null || hex.trim().isEmpty()) return new byte[0];
        String clean = hex.replaceAll("\\s+", "").toLowerCase();
        if (clean.length() % 2 != 0) {
            clean = "0" + clean;
        }
        int len = clean.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(clean.charAt(i), 16) << 4)
                    + Character.digit(clean.charAt(i + 1), 16));
        }
        return data;
    }

    /**
     * Encodage Base64
     */
    public static String toBase64(byte[] data) {
        if (data == null) return "";
        return Base64.getEncoder().encodeToString(data);
    }

    /**
     * Décodage Base64
     */
    public static byte[] fromBase64(String base64) {
        if (base64 == null || base64.trim().isEmpty()) return new byte[0];
        return Base64.getDecoder().decode(base64.trim());
    }

    /**
     * Formatage PEM pour clé publique (X.509)
     */
    public static String formatPublicKeyPem(byte[] encodedKey) {
        String base64 = Base64.getMimeEncoder(64, new byte[]{'\n'}).encodeToString(encodedKey);
        return "-----BEGIN PUBLIC KEY-----\n" + base64 + "\n-----END PUBLIC KEY-----";
    }

    /**
     * Formatage PEM pour clé privée (PKCS#8)
     */
    public static String formatPrivateKeyPem(byte[] encodedKey) {
        String base64 = Base64.getMimeEncoder(64, new byte[]{'\n'}).encodeToString(encodedKey);
        return "-----BEGIN PRIVATE KEY-----\n" + base64 + "\n-----END PRIVATE KEY-----";
    }

    /**
     * Nettoie une chaîne PEM pour en extraire les octets Base64
     */
    public static byte[] cleanPemKey(String pem) {
        if (pem == null) return new byte[0];
        String clean = pem.replaceAll("-----BEGIN [A-Z ]+-----", "")
                          .replaceAll("-----END [A-Z ]+-----", "")
                          .replaceAll("\\s+", "");
        return fromBase64(clean);
    }

    /**
     * Sauvegarde un tableau d'octets dans un fichier local (ex: C:/MTDSI/nomFichier)
     */
    public static String saveToFile(byte[] data, String directory, String filename) throws IOException {
        File dir = new File(directory);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        File target = new File(dir, filename);
        try (FileOutputStream fos = new FileOutputStream(target)) {
            fos.write(data);
        }
        return target.getAbsolutePath();
    }

    /**
     * Lecture d'un fichier local sous forme d'octets
     */
    public static byte[] readFromFile(String directory, String filename) throws IOException {
        File file = new File(directory, filename);
        if (!file.exists()) {
            file = new File(filename); // Fallback chemin absolu
        }
        return Files.readAllBytes(Paths.get(file.getAbsolutePath()));
    }
}
