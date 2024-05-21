using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class FileRecord
    {
        [Key]
        public int Id { get; set; }
        public required string FileName { get; set; }

        public required string FileKey { get; set; }

        public required string FileUrl { get; set; }

        // don't share the key!
        public object GetWithMappedFieldNames() => new { id = Id, name = FileName};
    }
}
