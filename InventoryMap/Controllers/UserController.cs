using Microsoft.AspNetCore.Mvc;

using BusinessLogic.User;
using BusinessRef.Model.User;
using BusinessRef.Interfaces.Customs;

namespace InventoryMap.Controllers
{
    public class UserController : Controller
    {
        [Route("/user/login", Name = "LoginView")]
        public IActionResult Login()
        {
            return View();
        }

        [Route("/user/logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();

            return RedirectToRoute("LoginView");
        }


        [Route("/user/login")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Login(UserLoginParamDataModel model)
        {
            try
            {
                model.IPAddress = Request.HttpContext.Connection.RemoteIpAddress.ToString();

                IGetUserLoginData data = new UserLoginDataLogic(model);

                var loginReturnData = data.GetUserLoginData();

                if (loginReturnData.StatusCodeNumber == 1)
                {

                    HttpContext.Session.SetString("StatusCodeNumber", loginReturnData.StatusCodeNumber.ToString());
                    HttpContext.Session.SetInt32("UserTypeID", 4);
                    HttpContext.Session.SetInt32("MasterPersonID", loginReturnData.MasterPersonID);
                    HttpContext.Session.SetString("FirstName", loginReturnData.FirstName.ToString());
                    HttpContext.Session.SetString("LastName", loginReturnData.LastName.ToString());
                    HttpContext.Session.SetString("LoginCode", loginReturnData.LoginCode);
                    //HttpContext.Session.SetString("AccountCode", Convert.ToBase64String(Encoding.UTF8.GetBytes(loginReturnData.AccountCode)));
                }

                return Json(loginReturnData);
            }
            catch (Exception)
            {
                return Json(new { StatusCodeNumber = 0 });
            }
        }
    }
}
