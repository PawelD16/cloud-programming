namespace Tic_Tac_Toe.Utils
{
    public static class UUIDGenerator
    {
        public static string GenerateUUID()
        {
            return Guid.NewGuid().ToString().ToUpper();
        }
    }
}
