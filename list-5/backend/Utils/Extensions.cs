using System.Net;

namespace backend.Utils
{
    public static class Extensions
    {
        public static bool IsSuccessStatusCode(this HttpStatusCode statusCode) =>
            (int)statusCode >= 200 && (int)statusCode <= 299;
    }
}
