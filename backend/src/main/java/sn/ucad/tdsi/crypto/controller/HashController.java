package sn.ucad.tdsi.crypto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sn.ucad.tdsi.crypto.dto.ApiResponse;
import sn.ucad.tdsi.crypto.dto.HashRequest;
import sn.ucad.tdsi.crypto.dto.HashResponse;
import sn.ucad.tdsi.crypto.service.CryptoUtils;
import sn.ucad.tdsi.crypto.service.HashService;

import jakarta.validation.Valid;

import java.security.MessageDigest;
import java.security.Principal;

@RestController
@RequestMapping("/api/crypto/hash")
public class HashController {

    @Autowired
    private HashService hashService;

    @PostMapping("/compute")
    public ResponseEntity<ApiResponse<HashResponse>> computeHash(@Valid @RequestBody HashRequest request, Principal principal) {
        String username = principal != null ? principal.getName() : "anonymous";
        HashResponse response = hashService.computeHash(request, username);

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage()));
        }
    }

    @PostMapping("/file")
    public ResponseEntity<ApiResponse<HashResponse>> hashFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "algo", defaultValue = "SHA-256") String algo,
            Principal principal) {
        try {
            MessageDigest md = MessageDigest.getInstance(algo);
            byte[] buffer = new byte[8192];
            int read;
            try (var is = file.getInputStream()) {
                while ((read = is.read(buffer)) != -1) {
                    md.update(buffer, 0, read);
                }
            }
            byte[] digest = md.digest();

            HashResponse response = new HashResponse();
            response.setSuccess(true);
            response.setAlgorithme(algo);
            response.setHashHex(CryptoUtils.toHex(digest));
            response.setHashBase64(CryptoUtils.toBase64(digest));
            response.setTailleOctets(digest.length);
            response.setTailleBits(digest.length * 8);
            response.setMessage("Condensat du fichier " + file.getOriginalFilename() + " calculé avec succès.");

            return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Erreur lors du hachage du fichier : " + e.getMessage()));
        }
    }
}
