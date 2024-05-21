using Amazon.S3;
using Amazon.S3.Model;
using backend.Utils;
using Microsoft.Extensions.Options;

namespace backend.Services
{
    public class S3Service
    {
        private readonly AwsSettings _awsSettings;
        private readonly IAmazonS3 _s3Client;

        public S3Service(IAmazonS3 s3Client, IOptions<AwsSettings> awsSettings)
        {
            _awsSettings = awsSettings.Value;
            _s3Client = s3Client;
        }

        public async Task<GetObjectResponse> DownloadFileAsync(string fileKey)
        {
            try
            {
                GetObjectRequest request = new()
                {
                    BucketName = _awsSettings.BucketName,
                    Key = fileKey
                };

                GetObjectResponse response = await _s3Client.GetObjectAsync(request);

                return response;
            }
            catch (AmazonS3Exception e)
            {
                throw new Exception($"{ErrorStrings.PROBLEM_ON_AWS} Message:'{e.Message}'");
            }
            catch (Exception e)
            {
                throw new Exception($"{ErrorStrings.UNKNOWN_ERROR}. Message:'{e.Message}'");
            }
        }

        public async Task<string?> UploadFileAsync(Stream fileStream, string fileKey)
        {
            PutObjectRequest request = new()
            {
                BucketName = _awsSettings.BucketName,
                Key = fileKey,
                InputStream = fileStream
            };

            PutObjectResponse response = await _s3Client.PutObjectAsync(request);

            return response.HttpStatusCode.IsSuccessStatusCode() 
                ? $"https://{_awsSettings.BucketName}.s3.amazonaws.com/{fileKey}" 
                : null;
        }

        public async Task<bool> DeleteFileAsync(string fileKey)
        {
            DeleteObjectRequest deleteObjectRequest = new()
            {
                BucketName = _awsSettings.BucketName,
                Key = fileKey
            };

            DeleteObjectResponse response = await _s3Client.DeleteObjectAsync(deleteObjectRequest);

            return response.HttpStatusCode.IsSuccessStatusCode();
        }
    }
}
