package sn.ucad.tdsi.crypto.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class APIExceptionHandler {

    @Autowired
    private MessageSource messageSource;

    private String getMessage(String key, Object[] args) {
        try {
            return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
        } catch (Exception e) {
            return key; // Fallback to key if not found
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIException> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        APIException apiException = new APIException(errorMessage, HttpStatus.BAD_REQUEST, LocalDateTime.now());
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<APIException> handleEntityNotFoundException(EntityNotFoundException ex) {
        String resolvedMessage = getMessage(ex.getMessageKey(), ex.getArgs());
        APIException apiException = new APIException(resolvedMessage, HttpStatus.NOT_FOUND, LocalDateTime.now());
        return new ResponseEntity<>(apiException, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RequestException.class)
    public ResponseEntity<APIException> handleRequestException(RequestException ex) {
        String resolvedMessage = getMessage(ex.getMessageKey(), ex.getArgs());
        APIException apiException = new APIException(resolvedMessage, HttpStatus.BAD_REQUEST, LocalDateTime.now());
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIException> handleGlobalException(Exception ex) {
        APIException apiException = new APIException("Une erreur inattendue s'est produite : " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, LocalDateTime.now());
        return new ResponseEntity<>(apiException, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
