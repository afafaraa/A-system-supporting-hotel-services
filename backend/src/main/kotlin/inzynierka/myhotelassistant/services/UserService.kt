package inzynierka.myhotelassistant.services

import inzynierka.myhotelassistant.models.user.UserEntity
import inzynierka.myhotelassistant.repositories.UserRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository): UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found: \"$username\"")
        return User.builder()
            .username(user.username)
            .password(user.password)
            .roles(*user.roles.map { it.name }.toTypedArray())
            .build()
    }

    fun findByEmail(email: String): UserEntity? {
        return userRepository.findAll().filter{ it.email == email }.firstOrNull()
    }

    fun findByUsername(username: String): UserEntity? = userRepository.findByUsername(username)

    fun existsByUsername(username: String): Boolean = userRepository.existsByUsername(username)

    fun save(user: UserEntity) = userRepository.save(user)
}