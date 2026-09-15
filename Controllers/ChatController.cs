using JGTX.Web.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;

namespace JGTX.Web.Controllers
{
    public class ChatController : Controller
    {
        private readonly ChatAgentService _agent;

        // Límite anti-spam: máx. 12 mensajes por cada 20 segundos por IP.
        private const int MaxMessages = 12;
        private static readonly TimeSpan Window = TimeSpan.FromSeconds(20);
        private static readonly ConcurrentDictionary<string, Queue<DateTime>> _throttle = new();

        public ChatController(ChatAgentService agent)
        {
            _agent = agent;
        }

        [HttpPost]
        [IgnoreAntiforgeryToken]
        public JsonResult Ask([FromBody] ChatAskRequest request)
        {
            try
            {
                var ip =
                    HttpContext.Connection.RemoteIpAddress?.ToString() ??
                    "unknown";

                if (IsThrottled(ip))
                {
                    return Json(new AgentReply
                    {
                        Ok = false,
                        Text = "Estás enviando mensajes muy rápido. Espera unos segundos y vuelve a intentarlo."
                    });
                }

                string message = request?.Message?.Trim() ?? "";

                if (string.IsNullOrWhiteSpace(message) || message.Length > 500)
                {
                    return Json(new AgentReply
                    {
                        Ok = false,
                        Text = "Escribe una consulta de máximo 500 caracteres para poder ayudarte."
                    });
                }

                return Json(_agent.Reply(message));
            }
            catch
            {
                return Json(new AgentReply
                {
                    Ok = false,
                    Text = "Ocurrió un problema. Intenta de nuevo en un momento."
                });
            }
        }

        private static bool IsThrottled(string ip)
        {
            var now = DateTime.UtcNow;
            var queue = _throttle.GetOrAdd(ip, _ => new Queue<DateTime>());

            lock (queue)
            {
                while (queue.Count > 0 &&
                       now - queue.Peek() > Window)
                {
                    queue.Dequeue();
                }

                if (queue.Count >= MaxMessages)
                {
                    return true;
                }

                queue.Enqueue(now);
                return false;
            }
        }
    }

    public class ChatAskRequest
    {
        public string? Message { get; set; }
    }
}