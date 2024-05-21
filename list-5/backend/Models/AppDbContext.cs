﻿
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<FileRecord> Files { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) { }
    }
}
