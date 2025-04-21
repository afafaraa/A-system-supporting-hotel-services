package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.exceptions.HttpException
import inzynierka.myhotelassistant.models.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository, private val passwordEncoder: PasswordEncoder): UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found: \"$username\"")
        return User.builder()
            .username(user.username)
            .password(user.password)
            .roles(user.role.name)
            .build()
    }

    fun save(user: UserEntity) = userRepository.save(user)

    fun findByEmail(email: String): UserEntity? {
        return userRepository.findAll().firstOrNull { it.email == email }
    }

    fun resetPassword(email: String, newPassword: String) {
        val user = this.findByEmail(email)
            ?: throw HttpException.UserNotFoundException("Email not found")

        user.password = passwordEncoder.encode(newPassword)
        user.let { this.save(it) }
    }

}