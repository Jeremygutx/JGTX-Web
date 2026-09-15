using Microsoft.AspNetCore.Mvc;

namespace JGTX.Web.Controllers
{
    public class ReviewsController : Controller
    {
        public IActionResult Index()
        {
            ViewData["Title"] = "Reseñas";
            ViewData["Description"] =
                "Reseñas y testimonios de clientes JGTX Tech: desarrollo web, aplicaciones, IA, " +
                "automatización, forense digital y transformación digital en Perú.";
            return View();
        }
    }
}