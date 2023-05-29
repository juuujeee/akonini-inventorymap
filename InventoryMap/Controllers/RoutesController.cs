using Microsoft.AspNetCore.Mvc;

namespace InventoryMap.Controllers
{
    public class RoutesController : Controller
    {
        [Route("/inventory-map")]
        [Route("/inventorymap-list")]
        [Route("/inventorymap-upload")]
        [Route("/inventorymap-detail")]
        public IActionResult Index()
        {
            return RedirectToRoute("Home");
        }
    }
}
