package sn.ucad.tdsi.crypto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sn.ucad.tdsi.crypto.dto.ApiResponse;
import sn.ucad.tdsi.crypto.dto.CipherRequest;
import sn.ucad.tdsi.crypto.dto.CipherResponse;
import sn.ucad.tdsi.crypto.service.AsymCryptoService;
import sn.ucad.tdsi.crypto.service.CryptoUtils;
import sn.ucad.tdsi.crypto.service.SymCryptoService;

import jakarta.validation.Valid;

import java.io.ByteArrayOutputStream;
import java.security.Principal;

@RestController
@RequestMapping("/api/crypto/cipher")
public class CipherController {

    @Autowired
    private SymCryptoService symCryptoService;

    @Autowired
    private AsymCryptoService asymCryptoService;

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<CipherResponse>> processCipher(@Valid @RequestBody CipherRequest request, Principal principal) {
        String username = principal != null ? principal.getName() : "anonymous";
        CipherResponse response;

        if ("ASYMETRIQUE".equalsIgnoreCase(request.getType()) || "RSA".equalsIgnoreCase(request.getAlgorithme())) {
            response = asymCryptoService.processAsymmetricCipher(request, username);
        } else {
            response = symCryptoService.processSymmetricCipher(request, username);
        }

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage()));
        }
    }

    @PostMapping(value = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> processFileCipher(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "algo", defaultValue = "AES") String algo,
            @RequestParam("key") String key,
            @RequestParam(value = "operation", defaultValue = "ENCRYPT") String operation,
            @RequestParam(value = "iv", required = false) String ivStr,
            Principal principal) {
        try {
            byte[] keyBytes = (key.matches("^[0-9a-fA-F]+$")) ? CryptoUtils.fromHex(key) : CryptoUtils.fromBase64(key);
            byte[] ivBytes = (ivStr != null && !ivStr.isEmpty()) ? CryptoUtils.fromHex(ivStr) : null;
            boolean isEncrypt = !"DECRYPT".equalsIgnoreCase(operation);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            symCryptoService.processFileCipher(algo, keyBytes, file.getInputStream(), outputStream, isEncrypt, ivBytes);

            byte[] resultBytes = outputStream.toByteArray();
            ByteArrayResource resource = new ByteArrayResource(resultBytes);

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document";
            String outFilename = isEncrypt ? originalName + ".enc" : originalName.replace(".enc", ".dec");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + outFilename + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(resultBytes.length)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Erreur lors du traitement du fichier : " + e.getMessage()));
        }
    }
}
