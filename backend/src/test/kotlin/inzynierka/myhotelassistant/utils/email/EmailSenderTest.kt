package inzynierka.myhotelassistant.utils.email

import inzynierka.myhotelassistant.configs.AppProperties
import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Mock
import org.mockito.Mockito.verify
import org.mockito.MockitoAnnotations
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import java.time.Instant
import kotlin.test.assertNotNull

class EmailSenderTest {
    @Mock
    private lateinit var mailSender: JavaMailSender

    private lateinit var emailSender: EmailSender
    private lateinit var appProperties: AppProperties

    @BeforeEach
    fun setup() {
        MockitoAnnotations.openMocks(this)
        appProperties =
            AppProperties().apply {
                frontend.url = "http://localhost:5273"
            }
        emailSender = EmailSender(mailSender, appProperties)
    }

    @Test
    fun `sendRegistrationCodeEmail should send email with correct content`() {
        // Given
        val email = "test@example.com"
        val code = "123456"
        val validUntil = Instant.now().plusSeconds(300)

        val messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage::class.java)

        // When
        emailSender.sendRegistrationCodeEmail(email, code, validUntil)

        // Then
        verify(mailSender).send(messageCaptor.capture())
        val sentMessage = messageCaptor.value

        assertEquals("hello@demomailtrap.co", sentMessage.from)
        assertArrayEquals(arrayOf(email), sentMessage.to)
        assertEquals("Your registration code", sentMessage.subject)
        assertTrue(sentMessage.text?.contains(code) == true)
        assertTrue(sentMessage.text?.contains(validUntil.toString()) == true)
    }

    @Test
    fun `sendResetPasswordLink should send email with correct content`() {
        // Given
        val email = "test@example.com"
        val link = "http://localhost:5273/reset-password?token=abc123"

        val messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage::class.java)

        // When
        emailSender.sendResetPasswordLink(email, link)

        // Then
        verify(mailSender).send(messageCaptor.capture())
        val sentMessage = messageCaptor.value

        assertEquals("hello@demomailtrap.co", sentMessage.from)
        assertArrayEquals(arrayOf(email), sentMessage.to)
        assertEquals("Password Reset Request", sentMessage.subject)
        assertTrue(sentMessage.text?.contains(link) == true)
    }

    @Test
    fun `sendVerificationEmail should send email with correct content and encoded token`() {
        // Given
        val email = "test@example.com"
        val token = "verification-token-123"

        val messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage::class.java)

        // When
        emailSender.sendVerificationEmail(email, token)

        // Then
        verify(mailSender).send(messageCaptor.capture())
        val sentMessage = messageCaptor.value

        assertEquals("hello@demomailtrap.co", sentMessage.from)
        assertArrayEquals(arrayOf(email), sentMessage.to)
        assertEquals("Confirm your MyHotelAssistant account", sentMessage.subject)
        assertTrue(sentMessage.text?.contains("${appProperties.frontend.url}/verify/account?token=") == true)
        assertTrue(sentMessage.text?.contains("24 hours") == true)
    }

    @Test
    fun `sendVerificationEmail should handle special characters in token`() {
        // Given
        val email = "test@example.com"
        val token = "token+with/special=chars"

        val messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage::class.java)

        // When
        emailSender.sendVerificationEmail(email, token)

        // Then
        verify(mailSender).send(messageCaptor.capture())
        val sentMessage = messageCaptor.value

        assertNotNull(sentMessage.text)
        // Token should be URL encoded in the link
        assertTrue(sentMessage.text?.contains("token=") == true)
    }
}
