using Microsoft.AspNetCore.Mvc;

using BusinessLogic.Project;
using BusinessRef.Model.Project;
using BusinessRef.Interfaces.Customs;

namespace InventoryMap.Controllers
{
    public class ProjectController : Controller
    {
        [Route("/project/get")]
        public IActionResult Get()
        {
            ProjectListParamDataModel model = new ProjectListParamDataModel
            {
                MasterPersonID = Convert.ToInt32(HttpContext.Session.GetInt32("MasterPersonID"))
            };

            IGetProjectListData dataLogic = new ProjectListDataLogic(model);

            return Json(dataLogic.GetProjectListData());
        }
    }
}
