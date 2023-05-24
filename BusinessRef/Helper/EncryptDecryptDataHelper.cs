
namespace BusinessRef.Helper
{
    public static class EncryptDecryptDataHelper
    {
        private static string PasswordPassPhrase = "MB1p8lYxGLLaCVuM";
        private static string LoginPassPhrase = "EKy4zveJby2RAajy";
        public static string EncryptPassword(string password)
        {
            return StringCipher.Encrypt(password, PasswordPassPhrase);
        }

        public static string DecryptPassword(string password)
        {
            return StringCipher.Decrypt(password, PasswordPassPhrase);
        }

        public static string EncryptLoginCode(string loginCode)
        {
            return StringCipher.Encrypt(loginCode, LoginPassPhrase);
        }

        public static string DecryptLoginCode(string loginCode)
        {
            return StringCipher.Decrypt(loginCode, LoginPassPhrase);
        }
    }
}
