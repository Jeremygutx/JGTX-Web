using Microsoft.AspNetCore.Mvc;

namespace JGTX.Web.Controllers
{
    public class ServicesController : Controller
    {
        private readonly IWebHostEnvironment _env;

        public ServicesController(IWebHostEnvironment env)
        {
            _env = env;
        }

        public IActionResult Index()
        {
            ViewData["Title"] = "Servicios";
            ViewData["Description"] =
                "Servicios de JGTX Tech: desarrollo web, aplicaciones, inteligencia artificial, " +
                "automatización, forense digital y transformación digital en Perú.";
            return View();
        }

        [HttpGet]
        public IActionResult ImagesVersion()
        {
            var dir = Path.Combine(_env.WebRootPath, "img", "services");
            long v = 0;
            if (Directory.Exists(dir))
            {
                foreach (var f in Directory.GetFiles(dir))
                {
                    var ticks = System.IO.File.GetLastWriteTimeUtc(f).Ticks;
                    if (ticks > v) v = ticks;
                }
            }
            return Json(new { v });
        }
    }
}