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

        val allowedTypes = listOf("image/jpeg", "image/jpg", "image/png", "image/webp")
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

            ResponseEntity.ok(response)
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Error: ${e.message}")
        }
    }

    @GetMapping("/files/{fileName:.+}")
    fun downloadFile(
        @PathVariable fileName: String,
    ): ResponseEntity<Resource> {
        val resource = fileStorageService.loadFileAsResource(fileName)
        val contentType =
            when (resource.filename?.substringAfterLast(".")?.lowercase()) {
                "jpg", "jpeg" -> "image/jpeg"
                "png" -> "image/png"
                "webp" -> "image/webp"
                else -> "application/octet-stream"
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
