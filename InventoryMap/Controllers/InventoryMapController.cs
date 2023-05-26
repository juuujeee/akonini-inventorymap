﻿using Microsoft.AspNetCore.Mvc;
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


        [Route("inventory-map/projectlotnameupdate")]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public IActionResult ProjectLotNameUpdate(ProjectLotNameUpdateParamDataModel model)
        {
            try
            {
                if(ModelState.IsValid)
                {
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
    }
}
