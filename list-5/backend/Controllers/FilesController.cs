using Amazon.S3.Model;
using backend.Models;
using backend.Services;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private const string ContentType = "Content-Type";

        private readonly AppDbContext _context;
        private readonly S3Service _s3Service;

        public FilesController(AppDbContext context, S3Service s3Service)
        {
            _context = context;
            _s3Service = s3Service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetFilesAsync() => 
            await _context.Files.Select(file => file.GetWithMappedFieldNames()).ToListAsync();

        [HttpGet("{id}")]
        public async Task<IActionResult> DownloadFile(int id)
        {
            FileRecord? fileRecord = await _context.Files.FindAsync(id);
            if (fileRecord == null)
                return NotFound(ErrorStrings.FILE_NOT_FOUND);

            GetObjectResponse response = await _s3Service.DownloadFileAsync(fileRecord.FileKey);

            if (response == null)
                return NotFound(ErrorStrings.FILE_NOT_FOUND_ON_AWS);

            Stream fileStream = response.ResponseStream;
            string contentType = response.Headers[ContentType];

            Response.Headers.Append(ContentType, contentType);

            return File(fileStream, contentType, fileRecord.FileName);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> RenameFile(int id, [FromQuery(Name = "fileName")] string fileName)
        {
            FileRecord? fileRecord = await _context.Files.FindAsync(id);
            if (fileRecord == null)
                return NotFound(ErrorStrings.FILE_NOT_FOUND);

            fileRecord.FileName = fileName;

            _context.Entry(fileRecord).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(ErrorStrings.NO_FILE_UPLOADED);

            using Stream stream = file.OpenReadStream(); 

            string fileName = Path.GetFileName(file.FileName);
            string fileKey = Guid.NewGuid().ToString();
            string? fileUrl = await _s3Service.UploadFileAsync(stream, fileKey);

            if (fileUrl == null)
                return BadRequest(ErrorStrings.COULDNT_BE_UPLOADED_TO_AWS);

            FileRecord fileRecord = new()
            {
                FileName = fileName,
                FileUrl = fileUrl,
                FileKey = fileKey,
            };

            _context.Files.Add(fileRecord);
            await _context.SaveChangesAsync();

            return Ok(fileRecord.GetWithMappedFieldNames());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(int id)
        {
            FileRecord? fileRecord = await _context.Files.FindAsync(id);

            if (fileRecord == null)
                return NotFound(ErrorStrings.FILE_NOT_FOUND);

            if (!await _s3Service.DeleteFileAsync(fileRecord.FileKey))
                return BadRequest(ErrorStrings.COULDNT_BE_DELETED);

            _context.Files.Remove(fileRecord);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
