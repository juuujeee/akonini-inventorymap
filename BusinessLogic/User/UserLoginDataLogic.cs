using BusinessRef.Interfaces.Customs;
using BusinessRef.Interfaces.Generics;

using DataAccess.User;
using BusinessRef.Model.User;

using model = BusinessRef.Model.User.UserLoginReturnDataModel;
using BusinessRef.Helper;

namespace BusinessLogic.User
{
    public class UserLoginDataLogic : IGetUserLoginData
    {
        private readonly UserLoginParamDataModel _dataModel;
        public UserLoginDataLogic(UserLoginParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }

        public model GetUserLoginData()
        {
            IPostDatabaseData<model> data = new UserLoginDataAccess(_dataModel);

            var obj = data.PostDatabaseData();

            if (obj.StatusCodeNumber == 4)
            {
                var passwordDecrypted = EncryptDecryptDataHelper.DecryptPassword(obj.ReturnIStillLoveYou);

                if (_dataModel.IStillLoveYou == passwordDecrypted)
                {
                    obj.StatusCodeNumber = 1;
                }
                else
                {
                    obj.StatusCodeNumber = 2;
                }
            }

            return obj;
        }
    }
}
