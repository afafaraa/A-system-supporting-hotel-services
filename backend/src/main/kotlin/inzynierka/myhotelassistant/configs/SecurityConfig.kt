package inzynierka.myhotelassistant.configs

import com.nimbusds.jose.JOSEException
import com.nimbusds.jose.jwk.JWKSet
import com.nimbusds.jose.jwk.RSAKey
import com.nimbusds.jose.jwk.source.JWKSource
import com.nimbusds.jose.proc.SecurityContext
import inzynierka.myhotelassistant.models.JWTType
import inzynierka.myhotelassistant.models.user.Role
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.security.access.hierarchicalroles.RoleHierarchy
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authManager(
        userDetailsService: UserDetailsService,
        passwordEncoder: PasswordEncoder,
    ): AuthenticationManager {
        val authProvider = DaoAuthenticationProvider(passwordEncoder)
        authProvider.setUserDetailsService(userDetailsService)
        return ProviderManager(authProvider)
    }

    @Bean
    fun roleHierarchy(): RoleHierarchy =
        RoleHierarchyImpl.fromHierarchy(
            "ROLE_ADMIN > ROLE_MANAGER" + "\n" +
                "ROLE_MANAGER > ROLE_RECEPTIONIST" + "\n" +
                "ROLE_RECEPTIONIST > ROLE_EMPLOYEE" + "\n" +
                "ROLE_ADMIN > ROLE_GUEST",
        )

    @Bean
    fun securityFilterChain(http: HttpSecurity): DefaultSecurityFilterChain =
        http
            .cors { cors -> cors.configurationSource(corsConfigurationSource()) }
            .csrf { csrf -> csrf.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/open/**")
                    .permitAll()
                    .requestMatchers("/uploads/files/**")
                    .permitAll()
                    .requestMatchers(
                        "/swagger-ui.html",
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/v3/api-docs.yaml",
                        "/swagger-resources/**",
                        "/webjars/**",
                    ).permitAll()
                    .requestMatchers("/secured/**")
                    .hasAnyRole(Role.ADMIN.name)
                    .requestMatchers("/management/**")
                    .hasAnyRole(Role.MANAGER.name)
                    .requestMatchers("/employee/**")
                    .hasAnyRole(Role.EMPLOYEE.name)
                    .anyRequest()
                    .authenticated()
            }.sessionManagement { session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt { it.jwtAuthenticationConverter(jwtAuthenticationConverter()) }
            }.build()

    @Bean
    fun jwtAuthenticationConverter(): Converter<Jwt, AbstractAuthenticationToken> {
        return object : Converter<Jwt, AbstractAuthenticationToken> {
            override fun convert(jwt: Jwt): AbstractAuthenticationToken? {
                val type = jwt.getClaimAsString("type")
                if (type != JWTType.ACCESS.name) {
                    throw BadCredentialsException("Invalid token type: expected ACCESS, got $type")
                }
                val authorities =
                    (jwt.getClaimAsString("role") ?: "")
                        .split(" ")
                        .map { role -> SimpleGrantedAuthority(role) }
                return JwtAuthenticationToken(jwt, authorities)
            }
        }
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
        configuration.allowedOriginPatterns = listOf("http://localhost:5173", "http://192.168.*:5173")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE")
        configuration.allowedHeaders = listOf("Authorization", "Content-Type")
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
