
namespace BusinessRef.Abstract
{
    public abstract class ErrorStatus
    {
        public bool HasError { get; set; } = false;
        public string ErrorMessage { get; set; } = "No Error";
    }
}
