using BusinessRef.Abstract;

namespace BusinessRef.Model.User
{
    public class UserLoginReturnDataModel : ErrorStatus
    {
        public int UserNameID { get; set; }
        public int StatusCodeNumber { get; set; }
        public int MasterPersonID { get; set; }
        public string AliasName { get; set; }
        public string ProfileImageFileName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ReturnUrl { get; set; }
        public string AccountCode { get; set; }
        public string ReturnIStillLoveYou { get; set; }
        public string LoginCode { get; set; }
    }
}
