using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace JGTX.Web.Controllers
{
    [Route("Newsletter")]
    public class NewsletterController : Controller
    {
        // Almacenamiento simple en memoria para el demo.
        // En producción: reemplazar por base de datos o servicio de email marketing.
        private static readonly List<string> _subscribers = new();

        [HttpPost]
        [Route("Subscribe")]
        public IActionResult Subscribe([FromForm] string email)
        {
            if (string.IsNullOrWhiteSpace(email) ||
                !new EmailAddressAttribute().IsValid(email))
            {
                return Json(new
                {
                    ok = false,
                    message = "Ingresa un correo electrónico válido."
                });
            }

            var normalized = email.Trim().ToLowerInvariant();

            if (_subscribers.Contains(normalized, StringComparer.OrdinalIgnoreCase))
            {
                return Json(new
                {
                    ok = false,
                    message = "Ya estás suscrito. Gracias por formar parte de JGTX."
                });
            }

            _subscribers.Add(normalized);

            return Json(new
            {
                ok = true,
                message = "¡Suscripción exitosa! Te avisaremos de novedades y lanzamientos.",
                count = _subscribers.Count
            });
        }
    }
}