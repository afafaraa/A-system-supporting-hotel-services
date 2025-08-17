package inzynierka.myhotelassistant.services

import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.stereotype.Service
import org.springframework.util.StringUtils
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.util.UUID

@Service
class FileStorageService(
    @Value("\${app.upload.dir:./uploads}") uploadDir: String,
) {
    private val fileStorageLocation: Path = Paths.get(uploadDir).toAbsolutePath().normalize()

    init {
        try {
            Files.createDirectories(this.fileStorageLocation)
        } catch (e: Exception) {
            throw RuntimeException("Could not create the directory where the uploaded files will be stored.", e)
        }
    }

    fun storeFile(file: MultipartFile): String {
        val fileName = StringUtils.cleanPath(file.originalFilename!!)

        return try {
            if (fileName.contains("..")) {
                throw RuntimeException("Sorry! Filename contains invalid path sequence $fileName")
            }

            val fileExtension = StringUtils.getFilenameExtension(fileName) ?: ""
            val uniqueFileName = "${UUID.randomUUID()}.$fileExtension"
            val targetLocation = this.fileStorageLocation.resolve(uniqueFileName)

            Files.copy(file.inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING)

            uniqueFileName
        } catch (e: IOException) {
            throw RuntimeException("Could not store file $fileName. Please try again!", e)
        }
    }

    fun loadFileAsResource(fileName: String): Resource {
        val filePath = this.fileStorageLocation.resolve(fileName).normalize()
        val resource = UrlResource(filePath.toUri())

        if (resource.exists()) {
            return resource
        } else {
            throw RuntimeException("File not found: $fileName")
        }
    }

    fun deleteFile(fileName: String): Boolean =
        try {
            val filePath = this.fileStorageLocation.resolve(fileName).normalize()
            Files.deleteIfExists(filePath)
        } catch (e: Exception) {
            false
        }
}