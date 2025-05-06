package inzynierka.myhotelassistant.exceptions

import org.springframework.http.HttpStatus

sealed class HttpException(
    val httpStatus: HttpStatus,
    message: String,
) : RuntimeException(message) {
    class UserAlreadyExistsException(
        message: String,
    ) : HttpException(HttpStatus.CONFLICT, message)

    class UserNotFoundException(
        message: String,
    ) : HttpException(HttpStatus.NOT_FOUND, message)

    class InvalidRoleNameException(
        message: String,
    ) : HttpException(HttpStatus.BAD_REQUEST, message)

    class InvalidRegistrationCodeException(
        message: String,
    ) : HttpException(HttpStatus.BAD_REQUEST, message)

    class InvalidArgumentException(
        message: String,
    ) : HttpException(HttpStatus.BAD_REQUEST, message)

    class ResetTokenValidationException(
        message: String,
    ) : HttpException(HttpStatus.BAD_REQUEST, message)
}
