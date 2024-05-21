namespace backend
{
    public class AwsSettings
    {
        public required string Region { get; set; }
        public required string AccessKey { get; set; }
        public required string SecretKey { get; set; }
        public required string Token { get; set; }
        public required string BucketName { get; set; }
    }
}
