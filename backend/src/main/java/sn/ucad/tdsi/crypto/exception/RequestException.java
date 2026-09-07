package sn.ucad.tdsi.crypto.exception;

public class RequestException extends RuntimeException {

    private final String messageKey;
    private final Object[] args;

    public RequestException(String messageKey, Object[] args) {
        super(messageKey);
        this.messageKey = messageKey;
        this.args = args;
    }

    public RequestException(String message) {
        super(message);
        this.messageKey = message;
        this.args = new Object[]{};
    }

    public String getMessageKey() {
        return messageKey;
    }

    public Object[] getArgs() {
        return args;
    }
}
