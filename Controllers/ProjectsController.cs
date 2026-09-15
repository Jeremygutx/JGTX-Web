using Microsoft.AspNetCore.Mvc;

namespace JGTX.Web.Controllers
{
    public class ProjectsController : Controller
    {
        public IActionResult Index()
        {
            ViewData["Title"] = "Proyectos";
            ViewData["Description"] =
                "Portafolio de proyectos JGTX Tech: casos de ingeniería digital, software e " +
                "inteligencia artificial construidos con resultados reales.";
            return View();
        }
    }
}
