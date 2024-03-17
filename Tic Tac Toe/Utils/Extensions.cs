namespace Tic_Tac_Toe.Utils
{
    public static class Extensions
    {
        public static T[] ToOneDimesional<T>(this T[,] twoD)
        {
            int size = twoD.Length;
            T[] result = new T[size];

            int write = 0;
            for (int i = 0; i <= twoD.GetUpperBound(0); ++i)
                for (int j = 0; j <= twoD.GetUpperBound(1); ++j)
                    result[write++] = twoD[i, j];

            return result;
        }
    }
}
