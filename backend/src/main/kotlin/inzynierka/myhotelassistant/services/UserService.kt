package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.controllers.user.AddUserController
import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.Role
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class UserService(private val userRepository: UserRepository,
                  private val passwordEncoder: PasswordEncoder): UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found: \"$username\"")
        return User.builder()
            .username(user.username)
            .password(user.password)
            .roles(user.role.name)
            .build()
    }

    fun findByUsername(username: String): UserEntity? = userRepository.findByUsername(username)

    fun existsByUsername(username: String): Boolean = userRepository.existsByUsername(username)

    fun save(user: UserEntity): UserEntity {
        if (existsByUsername(user.username))
            throw HttpException.UserAlreadyExistsException("User already exists: \"${user.username}\"")
        return userRepository.save(user)
    }

    fun createAdmin(request: AddUserController.NewAdminRequest): UserEntity {
        return UserEntity(
            username = "admin_${request.name}",
            password = passwordEncoder.encode(request.password),
            email = request.email,
            name = request.name.lowercase().replaceFirstChar { it.uppercase() },
            surname = request.surname.lowercase().replaceFirstChar { it.uppercase() },
            role = Role.ADMIN,
            checkInDate = Instant.now(),
        )
    }
}