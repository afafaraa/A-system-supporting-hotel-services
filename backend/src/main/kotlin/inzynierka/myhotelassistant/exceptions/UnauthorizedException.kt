package inzynierka.myhotelassistant.exceptions

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.FORBIDDEN)
class UnauthorizedException(
    message: String,
) : HttpException(httpStatus = HttpStatus.FORBIDDEN, message = message)
