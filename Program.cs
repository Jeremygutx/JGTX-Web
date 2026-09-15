using JGTX.Web.Services;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews(
    options =>
    {
        // Validación antiforgery global para todos los POST.
        options.Filters.Add(
            new Microsoft.AspNetCore.Mvc.AutoValidateAntiforgeryTokenAttribute());
    });

// Agente virtual de consultas
builder.Services.AddScoped<ChatAgentService>();

// Correo de contacto
builder.Services.AddScoped<EmailService>();

var app = builder.Build();

// Confiar en proxies (IIS / Nginx / Cloudflare) para HTTPS y direcciones reales
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto,
    KnownNetworks = { },
    KnownProxies = { }
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/Home/Error");
app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

// Rutas limpias para páginas de Home (enlaces canónicos /Contact y /About)
app.MapControllerRoute(
    name: "contact",
    pattern: "Contact",
    defaults: new { controller = "Home", action = "Contact" });

app.MapControllerRoute(
    name: "about",
    pattern: "About",
    defaults: new { controller = "Home", action = "About" });

// SEO: robots.txt y sitemap.xml con el dominio real (config Site:BaseUrl o el de la petición)
string ResolveBaseUrl(WebApplication appContext, HttpContext request)
{
    var configured = appContext.Configuration["Site:BaseUrl"];
    if (!string.IsNullOrWhiteSpace(configured))
        return configured.TrimEnd('/');

    var scheme = request.Request.Headers["X-Forwarded-Proto"].FirstOrDefault()
                 ?? request.Request.Scheme;
    return $"{scheme}://{request.Request.Host}";
}

app.MapGet("/robots.txt", (HttpContext ctx) =>
{
    var baseUrl = ResolveBaseUrl(app, ctx);
    return Results.Text(
        "User-agent: *\n" +
        "Allow: /\n\n" +
        $"Sitemap: {baseUrl}/sitemap.xml\n",
        "text/plain");
});

app.MapGet("/sitemap.xml", (HttpContext ctx) =>
{
    var baseUrl = ResolveBaseUrl(app, ctx);
    var paths = new[]
    {
        "/", "/Services", "/Projects", "/About",
        "/Contact", "/Reviews"
    };
    var xml = new System.Text.StringBuilder();
    xml.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
    xml.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
    foreach (var p in paths)
    {
        xml.AppendLine($"  <url><loc>{baseUrl}{p}</loc></url>");
    }
    xml.AppendLine("</urlset>");
    return Results.Text(xml.ToString(), "application/xml");
});

app.Run();