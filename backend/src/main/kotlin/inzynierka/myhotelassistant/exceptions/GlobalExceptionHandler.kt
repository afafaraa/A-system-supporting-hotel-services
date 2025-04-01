package inzynierka.myhotelassistant.exceptions

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.Instant

@RestControllerAdvice
class GlobalExceptionHandler {

    data class ErrorResponse(
        val error: String,
        val message: String,
        val timestamp: Instant = Instant.now()
    )

    @ExceptionHandler(HttpException::class)
    fun handleHttpException(e: HttpException): ResponseEntity<ErrorResponse> {
        return ResponseEntity
            .status(e.httpStatus)
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                ErrorResponse(
                    error = e::class.simpleName ?: "UnknownHttpException",
                    message = e.message ?: "Unexpected error occurred"
                )
            )
    }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(e: Exception): ResponseEntity<ErrorResponse> {
        return ResponseEntity
            .internalServerError()
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                ErrorResponse(
                    error = e::class.simpleName ?: "UnexpectedException",
                    message = e.message ?: "An unexpected error occurred"
                )
            )
    }
}