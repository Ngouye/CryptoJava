package sn.ucad.tdsi.crypto.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class APIException {
    private String message;
    private HttpStatus status;
    private LocalDateTime timestamp;
}
