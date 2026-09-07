package sn.ucad.tdsi.crypto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.ucad.tdsi.crypto.dto.ApiResponse;
import sn.ucad.tdsi.crypto.dto.KeyGenRequest;
import sn.ucad.tdsi.crypto.dto.KeyGenResponse;
import sn.ucad.tdsi.crypto.model.CryptoKey;
import sn.ucad.tdsi.crypto.model.User;
import sn.ucad.tdsi.crypto.repository.CryptoKeyRepository;
import sn.ucad.tdsi.crypto.repository.UserRepository;
import sn.ucad.tdsi.crypto.service.AsymCryptoService;
import sn.ucad.tdsi.crypto.service.SymCryptoService;

import jakarta.validation.Valid;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/crypto/keys")
public class CryptoKeyController {

    @Autowired
    private SymCryptoService symCryptoService;

    @Autowired
    private AsymCryptoService asymCryptoService;

    @Autowired
    private CryptoKeyRepository cryptoKeyRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<KeyGenResponse>> generateKey(@Valid @RequestBody KeyGenRequest request, Principal principal) {
        String username = principal != null ? principal.getName() : "anonymous";
        KeyGenResponse response;

        if ("ASYMETRIQUE".equalsIgnoreCase(request.getType())) {
            response = asymCryptoService.generateKeyPair(request, username);
        } else {
            response = symCryptoService.generateSymmetricKey(request, username);
        }

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage()));
        }
    }

    @GetMapping("/my-keys")
    public ResponseEntity<ApiResponse<List<CryptoKey>>> getMySavedKeys(Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(ApiResponse.success("Aucune clé", Collections.emptyList()));
        }
        User user = userRepository.findByLogin(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(ApiResponse.success("Aucune clé", Collections.emptyList()));
        }
        List<CryptoKey> keys = cryptoKeyRepository.findByUserIdOrderByDateGenerationDesc(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Mes clés sauvegardées", keys));
    }
}
