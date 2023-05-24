using Microsoft.AspNetCore.Mvc;

namespace InventoryMap.Controllers
{
    public class RoutesController : Controller
    {
        [Route("/inventory-map")]
        public IActionResult Index()
        {
            return RedirectToRoute("Home");
        }
    }
}
