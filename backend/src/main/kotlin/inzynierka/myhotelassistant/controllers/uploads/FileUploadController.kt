package inzynierka.myhotelassistant.controllers.uploads

import inzynierka.myhotelassistant.services.FileStorageService
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths

@RestController
@RequestMapping("/uploads")
class FileUploadController(
    private val fileStorageService: FileStorageService,
) {
    data class UploadResponse(
        val fileName: String,
        val downloadUri: String,
        val fileType: String,
        val size: Long,
    )
    @PostMapping("/image")
    fun uploadImage(
        @RequestParam("file") file: MultipartFile,
    ): ResponseEntity<*> {
        if (file.isEmpty) {
            return ResponseEntity.badRequest().body("Error: File is empty")
        }

        val allowedTypes =
            listOf(
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            )
        if (file.contentType !in allowedTypes) {
            return ResponseEntity.badRequest().body("Error: Illegal file format, try jpg/jpeg/png/webp")
        }

        val maxSize = 10 * 1024 * 1024L // 10MB
        if (file.size > maxSize) {
            return ResponseEntity.badRequest().body("Error: File cannot be larger than 10MB")
        }

        return try {
            val fileName = fileStorageService.storeFile(file)
            val fileDownloadUri =
                ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/uploads/files/")
                    .path(fileName)
                    .toUriString()

            val response =
                UploadResponse(
                    fileName = fileName,
                    downloadUri = fileDownloadUri,
                    fileType = file.contentType ?: "application/octet-stream",
                    size = file.size,
                )

            ResponseEntity.ok().body("ImageUrl: $fileDownloadUri")
        } catch (e: RuntimeException) {
            ResponseEntity.badRequest().body("Error: $e")
        }
    }

    @GetMapping("/files/{fileName:.+}")
    fun downloadFile(
        @PathVariable fileName: String,
    ): ResponseEntity<Resource> {
        val resource = fileStorageService.loadFileAsResource(fileName)
        var contentType: String? = null
        try {
            contentType = Files.probeContentType(Paths.get(resource.file.absolutePath))
        } catch (_: IOException) {
        }

        if (contentType == null) {
            contentType = "application/octet-stream"
        }

        return ResponseEntity
            .ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"${resource.filename}\"")
            .body(resource)
    }

    @DeleteMapping("/files/{fileName:.+}")
    fun deleteFile(
        @PathVariable fileName: String,
    ): ResponseEntity<*> =
        if (fileStorageService.deleteFile(fileName)) {
            ResponseEntity.ok().body("File deleted")
        } else {
            ResponseEntity.badRequest().body("Could not delete file")
        }
}
