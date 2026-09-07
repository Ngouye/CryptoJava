package sn.ucad.tdsi.crypto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.ucad.tdsi.crypto.dto.ApiResponse;
import sn.ucad.tdsi.crypto.dto.SignRequest;
import sn.ucad.tdsi.crypto.dto.SignResponse;
import sn.ucad.tdsi.crypto.dto.VerifyRequest;
import sn.ucad.tdsi.crypto.dto.VerifyResponse;
import sn.ucad.tdsi.crypto.service.SignatureService;

import jakarta.validation.Valid;

import java.security.Principal;

@RestController
@RequestMapping("/api/crypto/signature")
public class SignatureController {

    @Autowired
    private SignatureService signatureService;

    @PostMapping("/sign")
    public ResponseEntity<ApiResponse<SignResponse>> signData(@Valid @RequestBody SignRequest request, Principal principal) {
        String username = principal != null ? principal.getName() : "anonymous";
        SignResponse response = signatureService.signData(request, username);

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<VerifyResponse>> verifySignature(@Valid @RequestBody VerifyRequest request, Principal principal) {
        String username = principal != null ? principal.getName() : "anonymous";
        VerifyResponse response = signatureService.verifySignature(request, username);

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage()));
        }
    }
}
