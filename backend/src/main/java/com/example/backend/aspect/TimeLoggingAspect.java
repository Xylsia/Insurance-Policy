package com.example.backend.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Aspect
public class TimeLoggingAspect {

    @Before("within(com.example.backend..controller..*)")
    public void logControllerMethodEntry(JoinPoint joinPoint) {
        log.info("Controller Entry: {}, with args count: {}",
                joinPoint.getSignature().toShortString(), joinPoint.getArgs().length);
    }

    @AfterReturning(value = "within(com.example.backend..controller..*)", returning = "result")
    public void logControllerMethodExit(JoinPoint joinPoint, Object result) {
        if (result instanceof ResponseEntity<?> response) {
            log.info("Controller Exit: {}, with status: {}",
                    joinPoint.getSignature().toShortString(), response.getStatusCode());
        } else {
            log.info("Controller Exit: {}, with result type: {}",
                    joinPoint.getSignature().toShortString(), result.getClass().getSimpleName());
        }
    }

    @AfterThrowing(value = "within(com.example.backend..controller..*)", throwing = "exception")
    public void logControllerException(JoinPoint joinPoint, Throwable exception) {
        log.error("Controller Exception: {}, with cause: {}",
                joinPoint.getSignature().toShortString(), exception.getClass().getSimpleName());
    }

    @AfterThrowing(value = "within(com.example.backend..service..*)", throwing = "exception")
    public void logServiceException(JoinPoint joinPoint, Throwable exception) {
        log.error("Service Exception: {}, with cause: {}", joinPoint.getSignature().toShortString(),
                exception.getClass().getSimpleName());
    }
}
