using Microsoft.AspNetCore.Mvc;
using InventoryMap.Filters;
using BusinessLogic.InventoryMap;
using BusinessRef.Interfaces.Customs;
using BusinessRef.Model.InventoryMap;

namespace InventoryMap.Controllers
{
    [UserLoginFilter]
    public class InventoryMapController : Controller
    {

        [Route("inventorymap")]
        public IActionResult Index()
        {
            return PartialView("~/Views/InventoryMap/Index.cshtml");
        }

        [Route("/inventory-map/new")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Projectinventory(ProjectLotFromInventoryMapParamDataModel projectLot)
        {


            try
            {
                if (ModelState.IsValid)
                {
                    projectLot.MasterPersonID = Convert.ToInt32(HttpContext.Session.GetInt32("MasterPersonID"));

                    IProjectLotsNewData projectLotsNew = new ProjectLotsNewDataLogic(projectLot);

                    return Json(projectLotsNew.ProjectLotsNewData());

                }
                else
                {
                    var modelErrors = new Dictionary<string, string>();

                    foreach (var modelStatekey in ModelState.Keys)
                    {
                        var value = ModelState[modelStatekey];

                        if (value is not null)
                        {
                            foreach (var modelError in value.Errors)
                            {
                                modelErrors.Add(modelStatekey, modelError.ErrorMessage);
                            }
                        }

                    }
                    return Json(new { StatusCodeNumber = -1, responseText = modelErrors });
                }
            }
            catch(Exception ex)
            {
                return Json(new { StatusCodeNumber = 0, ErrorMessage = ex.Message }); 
            }

           

        }
    }
}
