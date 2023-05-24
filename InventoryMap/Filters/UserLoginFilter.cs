using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace InventoryMap.Filters
{
    public class UserLoginFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {


            int? masterPersonID = filterContext.HttpContext.Session.GetInt32("MasterPersonID");

            bool isExpired = false;

            if (masterPersonID == null)
            {
                isExpired = true;
            }
            else
            {
                int? userTypeID = filterContext.HttpContext.Session.GetInt32("UserTypeID");

                if (userTypeID != 4)
                {
                    isExpired = true;
                }
            }


            if (isExpired)
            {
                if (filterContext.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                {
                    filterContext.HttpContext.Response.Clear();
                    filterContext.HttpContext.Response.StatusCode = 440;
                }
                else
                {
                    filterContext.Result = new RedirectResult("/user/logout");

                }
            }
        }
    }
}
