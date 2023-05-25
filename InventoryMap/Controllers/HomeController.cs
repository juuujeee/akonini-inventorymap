using InventoryMap.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using InventoryMap.Filters;

namespace InventoryMap.Controllers
{
    [UserLoginFilter]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        [Route("/", Name = "Home")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("/indexview")]
        public IActionResult IndexView()
        {
            return PartialView("~/Views/Home/IndexView.cshtml");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}