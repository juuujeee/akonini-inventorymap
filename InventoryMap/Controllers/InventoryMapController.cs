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

        [Route("inventorymapupload/")]
        public IActionResult UploadInventoryMap()
        {
            return PartialView("~/Views/InventoryMap/UploadInventoryMap.cshtml");
        }

        [Route("inventorymaplist/")]
        public IActionResult InventoryMapList()
        {
            return PartialView("~/Views/InventoryMap/List.cshtml");
        }

        [Route("inventorymapimage")]

        public IActionResult Get(int id)
        {
            ProjectInventoryMapParamDataModel model = new ProjectInventoryMapParamDataModel
            {
                MasterProjectID = id
            };

            IGetProjectInventoryMapData dataLogic = new ProjectInventoryMapDataLogic(model);

            return Json(dataLogic.GetProjectInventoryMapData());
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

                    var obj = projectLotsNew.ProjectLotsNewData();

                    return Json(obj);

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


        [Route("inventory-map/projectlotnameupdate")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public IActionResult ProjectLotNameUpdate(ProjectLotNameUpdateParamDataModel model)
        {
            try
            {
                if(ModelState.IsValid)
                {
                    model.MasterPersonID = Convert.ToInt32(HttpContext.Session.GetInt32("MasterPersonID"));

                    IGetProjectLotNameUpdateData dataLogic = new ProjectLotNameUpdateDataLogic(model);

                    return Json(dataLogic.GetProjectLotNameUpdateData());
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
            catch (Exception ex)
            {
                return Json(new { StatusCodeNumber = 0, ErrorMessage = ex.Message });

            }

        }


        [Route("inventory-map/projectlotstatusupdate")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public IActionResult ProjectLotStatusUpdate(ProjectLotStatusUpdateParamDataModel model)
        {
            try
            {
                if(ModelState.IsValid)
                {
                    model.MasterPersonID = Convert.ToInt32(HttpContext.Session.GetInt32("MasterPersonID"));

                    IGetProjectLotStatusUpdateData dataLogic = new ProjectLotStatusUpdateDataLogic(model);

                    return Json(dataLogic.GetProjectLotStatusUpdateData());
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


        [Route("inventory-map/projectlotupdateref/{lotID}/{masterProjectID}")]
        public IActionResult ProjectLotUpdateRef(int lotID, int masterProjectID)
        {
            ProjectLotUpdateRefParamDataModel model = new ProjectLotUpdateRefParamDataModel
            {
                LotID = lotID,
                MasterProjectID = masterProjectID
            };

            IGetProjectLotUpdateRefData dataLogic = new ProjectLotUpdateRefDataLogic(model);

            return Json(dataLogic.GetProjectLotUpdateRefData());
        }


        [Route("inventory-map/getprojectlots")]
        public IActionResult GetProjectLots(int masterProjectID)
        {
            ProjectLotRecordParamDataModel model = new ProjectLotRecordParamDataModel
            {
                MasterProjectID = masterProjectID
            };

            IGetProjectLotRecordData dataLogic = new ProjectLotRecordDataLogic(model);

            return Json(dataLogic.GetProjectLotRecordData());
        }



        [Route("inventory-map/projectlotstatuslegendupdate")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult ProjectLotStatusLegendUpdate(ProjectLotStatusLegendUpdateParamDataModel model)
        {
            try
            {
                model.MasterPersonID = Convert.ToInt32(HttpContext.Session.GetInt32("MasterPersonID"));

                if(ModelState.IsValid)
                {
                    IGetProjectLotStatusLegendUpdateData dataLogic = new ProjectLotStatusLegendUpdateDataLogic(model);

                    return Json(dataLogic.GetProjectLotStatusLegendUpdateData());
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
