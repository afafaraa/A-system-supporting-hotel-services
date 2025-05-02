package inzynierka.myhotelassistant.exceptions

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.Instant

@RestControllerAdvice
class GlobalExceptionHandler {

    data class ErrorResponse(
        val error: String,
        val message: String,
        val data: Any? = null,
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

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleFieldValidationException(e: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        val errorsFields = e.bindingResult.fieldErrors.map { it.field }
        val errorMessages = e.bindingResult.fieldErrors.associate { error ->
            error.field to (error.defaultMessage ?: "Invalid value")
        }
        return ResponseEntity.badRequest().body(
            ErrorResponse(
                error = "ValidationException",
                message = "Validation failed with fields: ${errorsFields.joinToString(", ")}",
                data = errorMessages
            )
        )
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleJSONValidationException(e: HttpMessageNotReadableException): ResponseEntity<ErrorResponse> {
        val errorMessage = when {
            e.message?.contains("missing (therefore NULL) value") == true -> "Missing required field: ${e.message?.substringAfter("parameter ")?.substringBefore(" which") ?: "field"}"
            e.message?.contains("JSON parse error") == true -> "Invalid JSON format"
            else -> "Malformed request"
        }
        return ResponseEntity.badRequest().body(
            ErrorResponse(
                error = "RequestError",
                message = errorMessage
            ))
    }
}
