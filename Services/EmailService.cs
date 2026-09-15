using JGTX.Web.Controllers;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace JGTX.Web.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(
            IConfiguration configuration,
            ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public bool IsConfigured()
        {
            return !string.IsNullOrWhiteSpace(_configuration["Smtp:Host"]) &&
                   !string.IsNullOrWhiteSpace(_configuration["Smtp:Port"]) &&
                   !string.IsNullOrWhiteSpace(_configuration["Smtp:Username"]);
        }

        public async Task<EmailResult> SendContactAsync(ContactMessage message)
        {
            if (!IsConfigured())
            {
                _logger.LogWarning(
                    "Contacto recibido pero SMTP no está configurado. " +
                    "Configura Smtp:Host/Port/Username/Password/To para recibir correos.");

                return new EmailResult
                {
                    Ok = false,
                    Message = "Los mensajes no se están enviando todavía: falta configurar el correo."
                };
            }

            try
            {
                var host = _configuration["Smtp:Host"]!;
                var port = int.Parse(_configuration["Smtp:Port"]!);
                var useSsl = _configuration["Smtp:UseSsl"] == "true";
                var username = _configuration["Smtp:Username"]!;
                var password = _configuration["Smtp:Password"] ?? "";
                var fromAddress = _configuration["Smtp:From"] ?? username;
                var fromName = _configuration["Smtp:FromName"] ?? "JGTX Tech";
                var to = _configuration["Smtp:To"] ?? username;

                var mail = new MimeMessage();
                mail.From.Add(new MailboxAddress(fromName, fromAddress));
                mail.To.Add(new MailboxAddress("JGTX Tech", to));
                mail.ReplyTo.Add(new MailboxAddress(
                    $"{message.Name} {message.Lastname}",
                    message.Email));
                mail.Subject = $"Contacto web: {message.Subject}";

                mail.Body = new TextPart("plain")
                {
                    Text =
                        $"NOMBRE: {message.Name} {message.Lastname}\n" +
                        $"CORREO: {message.Email}\n" +
                        (string.IsNullOrWhiteSpace(message.Phone)
                            ? ""
                            : $"TELÉFONO: {message.Phone}\n") +
                        $"ASUNTO: {message.Subject}\n\n" +
                        $"MENSAJE:\n{message.Message}\n"
                };

                using var client = new SmtpClient();
                await client.ConnectAsync(
                    host,
                    port,
                    useSsl ? SecureSocketOptions.SslOnConnect
                           : SecureSocketOptions.StartTlsWhenAvailable);

                if (!string.IsNullOrWhiteSpace(password))
                {
                    await client.AuthenticateAsync(username, password);
                }

                await client.SendAsync(mail);
                await client.DisconnectAsync(true);

                return new EmailResult
                {
                    Ok = true,
                    Message = "¡Mensaje enviado! Te contactaremos a la brevedad."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enviando correo de contacto.");

                return new EmailResult
                {
                    Ok = false,
                    Message = "Ocurrió un problema al enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp."
                };
            }
        }
    }

    public class EmailResult
    {
        public bool Ok { get; set; }

        public string Message { get; set; } = "";
    }
}