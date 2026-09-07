package sn.ucad.tdsi.crypto.config;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    /**
     * Pointcut that matches Web REST endpoints.
     */
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void springBeanPointcut() {
        // Method is empty as this is just a Pointcut, the implementations are in the advices.
    }

    /**
     * Pointcut that matches all Spring beans in the application's main packages.
     */
    @Pointcut("within(sn.ucad.tdsi.crypto..*)" +
            " || within(sn.ucad.tdsi.crypto.controller..*)")
    public void applicationPackagePointcut() {
        // Method is empty as this is just a Pointcut, the implementations are in the advices.
    }

    /**
     * Advice that logs methods throwing exceptions.
     *
     * @param joinPoint join point for advice
     * @param e         exception
     */
    @AfterThrowing(pointcut = "applicationPackagePointcut() && springBeanPointcut()", throwing = "e")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        log.error("Exception in {}.{}() with message = {}", joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(), e.getMessage());
    }

    /**
     * Advice that logs when a method is entered and exited.
     *
     * @param joinPoint join point for advice
     * @return result
     * @throws Throwable throws IllegalArgumentException
     */
    @Around("applicationPackagePointcut() && springBeanPointcut()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String declaringType = joinPoint.getSignature().getDeclaringTypeName();

        // Masquage simple des arguments (Security)
        String argsString = "[PROTECTED DATA]";
        if (log.isDebugEnabled()) {
            if (methodName.toLowerCase().contains("login") || methodName.toLowerCase().contains("cipher") || methodName.toLowerCase().contains("hash") || methodName.toLowerCase().contains("sign")) {
                argsString = "[MASKED FOR SECURITY]";
            } else {
                argsString = Arrays.toString(joinPoint.getArgs());
            }
        }

        log.debug("Enter: {}.{}() with argument[s] = {}", declaringType, methodName, argsString);
        
        Object result = joinPoint.proceed();
        
        log.debug("Exit: {}.{}() with result = {}", declaringType, methodName, result != null ? "[RESULT]" : "null");
        return result;
    }
}
