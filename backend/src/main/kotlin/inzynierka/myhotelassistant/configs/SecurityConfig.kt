package inzynierka.myhotelassistant.configs

import com.nimbusds.jose.JOSEException
import com.nimbusds.jose.jwk.JWKSet
import com.nimbusds.jose.jwk.RSAKey
import com.nimbusds.jose.jwk.source.JWKSource
import com.nimbusds.jose.proc.SecurityContext
import inzynierka.myhotelassistant.models.Role
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.oauth2.jwt.*
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.core.convert.converter.Converter
import org.springframework.security.access.hierarchicalroles.RoleHierarchy
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import java.util.*

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authManager(userDetailsService: UserDetailsService, passwordEncoder: PasswordEncoder): AuthenticationManager {
        val authProvider = DaoAuthenticationProvider()
        authProvider.setUserDetailsService(userDetailsService)
        authProvider.setPasswordEncoder(passwordEncoder)
        return ProviderManager(authProvider)
    }

    @Bean
    fun roleHierarchy(): RoleHierarchy {
        return RoleHierarchyImpl.fromHierarchy(
            "ROLE_ADMIN > ROLE_MANAGER" + "\n" +
                    "ROLE_MANAGER > ROLE_RECEPTIONIST" + "\n" +
                    "ROLE_RECEPTIONIST > ROLE_EMPLOYEE"
        )
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): DefaultSecurityFilterChain {
        return http
            .cors { cors -> cors.configurationSource(corsConfigurationSource()) }
            .csrf { csrf -> csrf.disable() }
            .authorizeHttpRequests { auth -> auth
                .requestMatchers("/token").permitAll()
                .requestMatchers("/open/**").permitAll()
                .requestMatchers("/secured/**").hasAnyRole(Role.ADMIN.name)
                .requestMatchers("/management/**").hasAnyRole(Role.MANAGER.name)
                .anyRequest().authenticated()
            }
            .sessionManagement { session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt { it.jwtAuthenticationConverter(jwtAuthenticationConverter()) }
            }
            .build()
    }

    @Bean
    fun jwtAuthenticationConverter(): Converter<Jwt, AbstractAuthenticationToken> {
        val converter = JwtAuthenticationConverter()
        converter.setJwtGrantedAuthoritiesConverter { jwt: Jwt ->
            val scope = jwt.getClaimAsString("scope") ?: ""
            scope.split(" ").map { role ->
                if (role.startsWith("ROLE_")) SimpleGrantedAuthority(role)
                else SimpleGrantedAuthority("ROLE_$role")
            }
        }
        return converter
    }

    @Bean
    fun jwkSource(rsaKey: RSAKey): JWKSource<SecurityContext> {
        val jwkSet = JWKSet(rsaKey)
        return JWKSource { jwkSelector, _ -> jwkSelector.select(jwkSet) }
    }

    @Bean
    fun jwtEncoder(jwks: JWKSource<SecurityContext>): JwtEncoder = NimbusJwtEncoder(jwks)

    @Bean
    @Throws(JOSEException::class)
    fun jwtDecoder(rsaKey: RSAKey): JwtDecoder = NimbusJwtDecoder.withPublicKey(rsaKey.toRSAPublicKey()).build()

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:5173")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE")
        configuration.allowedHeaders = listOf("Authorization", "Content-Type")
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}