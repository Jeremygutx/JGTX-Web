using JGTX.Web.Models;
using JGTX.Web.Services;
using JGTX.Web.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace JGTX.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly EmailService _emailService;

        public HomeController(EmailService emailService)
        {
            _emailService = emailService;
        }
        public IActionResult Index()
        {
            ViewData["Title"] = "Inicio";
            ViewData["Description"] =
                "JGTX Tech: transformamos ideas en productos digitales con ingeniería, " +
                "inteligencia artificial y automatización. Servicios de tecnología en Perú.";

            return View(new HomeViewModel());
        }

        public IActionResult About()
        {
            ViewData["Title"] = "Nosotros";
            ViewData["Description"] =
                "Conoce JGTX Tech: una marca de ingeniería digital que convierte ideas " +
                "en productos reales con estrategia, diseño, software e inteligencia artificial.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Title"] = "Contacto";
            ViewData["Description"] =
                "Hablemos de tu proyecto. JGTX Tech te acompaña con servicios de desarrollo web, " +
                "aplicaciones, IA, automatización y transformación digital.";

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ContactSubmit(ContactMessage model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new
                {
                    ok = false,
                    message =
                        "Por favor revisa los campos obligatorios e inténtalo de nuevo."
                });
            }

            var result = await _emailService.SendContactAsync(model);

            return Json(new
            {
                ok = result.Ok,
                message = result.Message
            });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = HttpContext.TraceIdentifier });
        }
    }

    public class ContactMessage
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(80)]
        public string Name { get; set; } = "";

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [StringLength(80)]
        public string Lastname { get; set; } = "";

        [Required(ErrorMessage = "El correo es obligatorio.")]
        [EmailAddress(ErrorMessage = "Ingresa un correo válido.")]
        public string Email { get; set; } = "";

        public string Phone { get; set; } = "";

        [Required(ErrorMessage = "El asunto es obligatorio.")]
        [StringLength(120)]
        public string Subject { get; set; } = "";

        [Required(ErrorMessage = "El mensaje es obligatorio.")]
        [StringLength(3000)]
        public string Message { get; set; } = "";
    }
}