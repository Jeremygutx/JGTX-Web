using System.Text;

namespace JGTX.Web.Services
{
    public class AgentReply
    {
        public bool Ok { get; set; } = true;
        public string Text { get; set; } = "";
        public string[] Suggestions { get; set; } = Array.Empty<string>();
    }

    public class ChatAgentService
    {
        private static readonly Dictionary<char, char> Accents = new()
        {
            ['á'] = 'a', ['é'] = 'e', ['í'] = 'i', ['ó'] = 'o', ['ú'] = 'u',
            ['ü'] = 'u', ['ñ'] = 'n'
        };

        private sealed class Rule
        {
            public string[] Phrases = Array.Empty<string>();
            public string[] Keywords = Array.Empty<string>();
            public AgentReply Reply = new();
        }

        private static readonly string Wa =
            "https://wa.me/51999999999?text=Hola%20JGTX%20Tech.%20Vengo%20del%20chat%20de%20la%20web.";

        private static readonly string[] Principales =
        {
            "¿Qué servicios ofrecen?",
            "¿Cuánto cuesta un proyecto?",
            "¿Cómo es el proceso de trabajo?",
            "Formas de contacto"
        };

        private static readonly Rule[] Rules =
        {
            new Rule
            {
                Phrases = new[] { "hola", "buenos dias", "buenas tardes", "buenas noches", "que tal", "hey", "saludos", "holi", "alo", "aloo", "ola", "como estas" },
                Keywords = new[] { "hola", "saludos", "hey", "buenas" },
                Reply = new AgentReply
                {
                    Text = "Hola, soy el agente virtual de JGTX Tech. Puedo ayudarte con los servicios, el proceso de trabajo, los tiempos y las formas de contacto.\n\n¿Sobre qué te gustaría consultar?",
                    Suggestions = Principales
                }
            },
            new Rule
            {
                Phrases = new[] { "que son", "que hacen", "que ofrecen", "cuales son sus servicios", "catalogo", "lista de servicios", "todos los servicios" },
                Keywords = new[] { "servicio", "ofrecen", "hacen", "brindan", "soluciones" },
                Reply = new AgentReply
                {
                    Text = "En JGTX Tech trabajamos 6 áreas:\n\n**Desarrollo Web** — webs corporativas, landing pages, e-commerce y sistemas web.\n**Aplicaciones** — apps empresariales y plataformas a medida.\n**IA aplicada** — asistentes inteligentes e integración de IA.\n**Automatización** — flujos inteligentes y optimización operativa.\n**Forense Digital** — análisis de evidencia digital.\n**Transformación Digital** — estrategia e integración tecnológica.\n\nPuedes revisar el detalle de cada una:\n/Services",
                    Suggestions = new[]
                    {
                        "¿Cuánto cuesta una página web?",
                        "¿Cómo es el proceso?",
                        "¿Qué es la IA aplicada?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "pagina web", "landing page", "sitio web", "desarrollo web", "hacer mi pagina", "crear web", "tienda online", "e-commerce", "ecommerce", "e commerce", "sistema web", "web corporativa", "web empresarial" },
                Keywords = new[] { "web", "pagina", "sitio", "landing", "tienda", "ecommerce", "sistemas", "sistema", "target" },
                Reply = new AgentReply
                {
                    Text = "El **Desarrollo Web** incluye:\n\n- Webs corporativas y landing pages\n- Tiendas online (e-commerce)\n- Sistemas web modernos, rápidos y escalables\n\nPara una cotización precisa necesitamos conocer tu objetivo. Escríbenos por WhatsApp:\n" + Wa + "\n\nTambién puedes enviarnos tu requerimiento:\n/Home/Contact\nRespondemos en menos de 24 horas.",
                    Suggestions = new[]
                    {
                        "¿Cuánto cuesta una página web?",
                        "¿Cuánto tarda un proyecto web?",
                        "Cotizar mi proyecto"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "que es ia aplicada", "ia aplicada", "que es inteligencia artificial", "asistentes inteligentes", "chatbot", "modelo ia" },
                Keywords = new[] { "inteligencia", "ia", "iaa", "modelo", "asistente", "bot" },
                Reply = new AgentReply
                {
                    Text = "La **IA aplicada** integra inteligencia artificial en productos y procesos:\n\n- Asistentes inteligentes\n- Procesamiento de información\n- Soluciones personalizadas\n\nEs ideal para automatizar decisiones y crear experiencias más eficientes. ¿Te gustaría usar IA en tu negocio? Cuéntanos tu idea por WhatsApp:\n" + Wa,
                    Suggestions = new[]
                    {
                        "¿Qué servicios ofrecen?",
                        "Cotizar mi proyecto"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "precio pagina web", "cuanto cuesta", "cuanto vale", "que precio", "cuanto cobran", "presupuesto", "cotizacion", "cotizar", "tarifa", "costos", "cuanto cobra" },
                Keywords = new[] { "cuesta", "costo", "precio", "presupuesto", "cotizar", "tarifa", "cobrar", "valor" },
                Reply = new AgentReply
                {
                    Text = "Cada proyecto es a medida, por eso el costo depende del alcance:\n\n- Tipo de solución\n- Funcionalidades\n- Plazos de entrega\n\nPara darte una cotización certera necesitamos conocer tu idea. Escríbenos por WhatsApp:\n" + Wa + "\n\nEnvía tu requerimiento:\n/Home/Contact\nRespondemos en menos de 24 horas.",
                    Suggestions = new[]
                    {
                        "¿Cuánto tarda un proyecto?",
                        "¿Cómo es el proceso de trabajo?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "cuanto tarda", "cuanto demora", "en cuanto tiempo", "plazo", "tiempo de entrega", "cuanto tiempo", "duracion", "semanas" },
                Keywords = new[] { "tarda", "demora", "plazo", "tiempo", "semanas", "duracion", "rapido" },
                Reply = new AgentReply
                {
                    Text = "Los plazos dependen del alcance:\n\n- Landing o web sencilla: de 2 a 4 semanas\n- Webs o plataformas completas: de 6 a 10 semanas\n\nEn la reunión inicial definimos alcance, entregables y cronograma. ¿Quieres iniciar tu proyecto? Escríbenos por WhatsApp:\n" + Wa,
                    Suggestions = new[]
                    {
                        "¿Cuánto cuesta un proyecto?",
                        "¿Cómo es el proceso?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "como es el proceso", "como trabajan", "pasos", "metodologia", "como arrancan", "por donde empiezan", "como empieza", "mundo del trabajo" },
                Keywords = new[] { "proceso", "pasos", "etapas", "metodologia", "trabajan", "arrancan", "empezar" },
                Reply = new AgentReply
                {
                    Text = "Trabajamos en 4 etapas:\n\n**01 · Descubrimiento** — reunión inicial, análisis de necesidades y definición de objetivos.\n**02 · Diseño** — arquitectura, UX/UI, prototipado y validación.\n**03 · Construcción** — frontend, backend, integraciones, IA y pruebas.\n**04 · Lanzamiento** — testing final, implementación, monitoreo y soporte.\n\nTodo con un enfoque 100% digital.",
                    Suggestions = new[]
                    {
                        "¿Cuánto cuesta un proyecto?",
                        "¿Qué servicios ofrecen?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "hablar con una persona", "con un humano", "asesor real", "atencion humana", "hablar con alguien", "un asesor", "agente real", "soporte humano" },
                Keywords = new[] { "persona", "humano", "asesor", "alguien" },
                Reply = new AgentReply
                {
                    Text = "Claro, un asesor real te atenderá de inmediato\n" + Wa + "\n\nO déjanos tu mensaje:\n/Home/Contact\nTe escribimos en menos de 24 horas.",
                    Suggestions = new[]
                    {
                        "¿Qué servicios ofrecen?",
                        "¿Cómo es el proceso?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "formas de contacto", "como los contacto", "como los escribo", "contactarlos", "donde escribo", "canales", "quien atiende" },
                Keywords = new[] { "contacto", "contactar", "escribir", "atencion", "comunicar", "redes" },
                Reply = new AgentReply
                {
                    Text = "Puedes escribirnos por estos canales:\n\n" + Wa + "\nhttps://www.instagram.com/jgtx.tech/\nhttps://www.tiktok.com/@jgtx.tech\n\n**Horario:** lunes a sábado de 9:00 a 19:00.\n\nTambién puedes usar el formulario:\n/Home/Contact\nRespondemos en menos de 24 horas.",
                    Suggestions = new[]
                    {
                        "¿Qué servicios ofrecen?",
                        "¿Cómo es el proceso?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "cotizar mi proyecto", "iniciar proyecto", "quiero un proyecto", "propuesta", "un proyecto", "proyecto nuevo", "mi idea" },
                Keywords = new[] { "proyecto", "idea", "cotizar" },
                Reply = new AgentReply
                {
                    Text = "Perfecto, para iniciar tu proyecto comparte tu idea: qué necesitas lograr, para quién y en qué plazo.\n\nEscríbenos directo por WhatsApp:\n" + Wa + "\n\nO completa el formulario:\n/Home/Contact\nEn menos de 24 horas un asesor te responde con los siguientes pasos.",
                    Suggestions = new[]
                    {
                        "¿Cómo es el proceso de trabajo?",
                        "¿Cuánto cuesta un proyecto?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "que es forense digital", "forense", "evidencia digital", "ciberseguridad", "seguridad informatica", "periciales" },
                Keywords = new[] { "forense", "pericial", "evidencia", "ciberseguridad", "seguridad" },
                Reply = new AgentReply
                {
                    Text = "El **Forense Digital** es la investigación y análisis técnico de evidencia digital:\n\n- Análisis de evidencia digital\n- Investigación técnica\n- Preservación y documentación\n- Informes técnicos\n\n¿Necesitas este servicio? Escríbenos por WhatsApp:\n" + Wa,
                    Suggestions = new[]
                    {
                        "¿Qué servicios ofrecen?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "transformacion digital", "digitalizar", "equipo digital", "modernizar procesos", "estrategia digital", "ruta tecnologica" },
                Keywords = new[] { "transformacion", "digitalizar", "modernizar" },
                Reply = new AgentReply
                {
                    Text = "La **Transformación Digital** diseña la ruta tecnológica para modernizar tu operación:\n\n- Digitalización de procesos\n- Arquitectura de soluciones\n- Integración tecnológica\n- Estrategia digital\n\n¿Quieres saber si tu negocio está listo? Escríbenos por WhatsApp:\n" + Wa,
                    Suggestions = new[]
                    {
                        "¿Qué servicios ofrecen?",
                        "¿Cómo es el proceso?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "aplicaciones", "app movil", "app empresarial", "aplicacion", "desarrollo de apps", "app a medida", "plataforma", "panel administrativo" },
                Keywords = new[] { "app", "aplicacion", "movil", "plataforma" },
                Reply = new AgentReply
                {
                    Text = "Creamos **aplicaciones y plataformas personalizadas** para negocios que necesitan procesos a su medida:\n\n- Apps empresariales\n- Paneles administrativos\n- Integraciones\n\nSi tienes una necesidad concreta, compártela por WhatsApp:\n" + Wa + "\n\nUn asesor te orientará.",
                    Suggestions = new[]
                    {
                        "¿Cuánto cuesta un proyecto?",
                        "¿Qué servicios ofrecen?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "automatizacion", "automatizar", "flujos inteligentes", "repetitivas", "automatismos" },
                Keywords = new[] { "automatiz", "automatizar", "flujos" },
                Reply = new AgentReply
                {
                    Text = "La **Automatización** convierte tareas repetitivas en flujos inteligentes:\n\n- Automatización de procesos\n- Integraciones entre sistemas\n- Optimización operativa\n\nAsí reduces tiempos, errores y costos operativos. ¿Qué proceso quieres optimizar? Escríbenos por WhatsApp:\n" + Wa,
                    Suggestions = new[]
                    {
                        "¿Qué servicios ofrecen?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "donde estan", "ubicacion", "donde queda", "direccion", "en que pais", "de donde son", "que ciudad" },
                Keywords = new[] { "ubicacion", "direccion", "pais", "ciudad", "donde" },
                Reply = new AgentReply
                {
                    Text = "JGTX Tech es una marca de ingeniería digital de Perú. Trabajamos 100% en remoto, por eso podemos atender tu proyecto estés donde estés, con disponibilidad 24/7.",
                    Suggestions = new[]
                    {
                        "¿Qué servicios ofrecen?",
                        "Formas de contacto"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "horario", "en que horario", "a que hora", "atencion", "abren" },
                Keywords = new[] { "horario", "hora", "atend" },
                Reply = new AgentReply
                {
                    Text = "Nuestro horario de atención es de **lunes a sábado de 9:00 a 19:00**. Por WhatsApp respondemos de inmediato dentro de ese rango.\n\nFuera de horario, puedes dejar tu mensaje:\n/Home/Contact\nTe responderemos en menos de 24 horas.",
                    Suggestions = new[]
                    {
                        "Formas de contacto"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "quienes son", "quien es jgtx", "que es jgtx", "sobre la empresa", "historia", "equipo jgtx", "acerca de" },
                Keywords = new[] { "jgtx", "empresa", "quien", "equipo", "nosotros", "sobre" },
                Reply = new AgentReply
                {
                    Text = "JGTX Tech es una marca de ingeniería digital que convierte ideas en productos reales con estrategia, diseño, software e inteligencia artificial.\n\nNos enfocamos en un proyecto a la vez para garantizar 100% de atención y calidad.",
                    Suggestions = new[]
                    {
                        "¿Qué servicios ofrecen?",
                        "¿Cómo es el proceso?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "portafolio", "proyectos realizados", "clientes", "trabajos hechos", "proyectos" },
                Keywords = new[] { "portafolio", "proyecto", "clientes", "trabajos" },
                Reply = new AgentReply
                {
                    Text = "Puedes conocer nuestras áreas de trabajo (web, aplicaciones, IA, automatización, forense digital y transformación digital):\n/Projects\n\nTrabajamos un proyecto a la vez para enfocarnos al 100% en cada cliente.",
                    Suggestions = new[]
                    {
                        "¿Qué servicios ofrecen?"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "instagram", "tiktok", "redes", "siguen", "cuenta de insta" },
                Keywords = new[] { "instagram", "tiktok", "redes" },
                Reply = new AgentReply
                {
                    Text = "Síguenos en nuestras redes:\n\nhttps://www.instagram.com/jgtx.tech/\nhttps://www.tiktok.com/@jgtx.tech",
                    Suggestions = new[]
                    {
                        "Formas de contacto"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "gracias", "genial", "excelente", "perfecto", "okey", "ok", "entendido", "de acuerdo", "suena bien", "me sirve", "muchas gracias" },
                Keywords = new[] { "gracias", "genial", "excelente", "perfecto", "ok" },
                Reply = new AgentReply
                {
                    Text = "Con gusto. Cuando necesites algo de JGTX Tech aquí estaré.\n\nPuedo ayudarte con servicios, cotizaciones, el proceso de trabajo o las formas de contacto.",
                    Suggestions = new[]
                    {
                        "¿Qué servicios ofrecen?",
                        "Formas de contacto"
                    }
                }
            },
            new Rule
            {
                Phrases = new[] { "adios", "chao", "hasta luego", "nos vemos", "bye", "hasta pronto", "me voy" },
                Keywords = new[] { "adios", "chao", "bye", "luego" },
                Reply = new AgentReply
                {
                    Text = "Gracias por escribirnos. Cuando quieras, seguiré aquí para ayudarte con tus consultas.\n\nÉxitos con tu proyecto.",
                    Suggestions = new[]
                    {
                        "Formas de contacto"
                    }
                }
            }
        };

        private static readonly AgentReply Fallback = new()
        {
            Text = "No estoy seguro de haber entendido tu consulta. Puedo ayudarte con:\n\n- Servicios\n- Cotización\n- Proceso de trabajo\n- Tiempos\n- Formas de contacto\n\nEscríbeme de otra forma o habla directo con un asesor por WhatsApp:\n" + Wa,
            Suggestions = Principales
        };

        public AgentReply Reply(string message)
        {
            string input = Normalize(message);
            string[] tokens = input.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            Rule best = null!;
            int bestScore = -1;

            foreach (Rule rule in Rules)
            {
                int phraseScore = 0;
                int keywordScore = 0;

                foreach (string phrase in rule.Phrases)
                {
                    if (Matches(phrase, input, tokens))
                    {
                        phraseScore += phrase.Length;
                    }
                }

                foreach (string keyword in rule.Keywords)
                {
                    if (Matches(keyword, input, tokens))
                    {
                        keywordScore += 1;
                    }
                }

                int score = phraseScore * 10 + keywordScore;

                if (score > bestScore)
                {
                    bestScore = score;
                    best = rule;
                }
            }

            return bestScore > 0 ? best.Reply : Fallback;
        }

        private static bool Matches(string pattern, string input, string[] tokens)
        {
            if (input.Contains(pattern))
            {
                if (pattern.Length > 3)
                {
                    return true;
                }

                return Array.Exists(tokens, token => token == pattern);
            }

            return false;
        }

        private static string Normalize(string input)
        {
            var sb = new StringBuilder(input.Length);

            foreach (char c in input.ToLowerInvariant())
            {
                if (Accents.TryGetValue(c, out char plain))
                {
                    sb.Append(plain);
                }
                else if (char.IsLetterOrDigit(c) || c == '.' || c == '/')
                {
                    sb.Append(c);
                }
                else if (c == ' ')
                {
                    sb.Append(c);
                }
            }

            return sb.ToString().Replace("  ", " ").Trim();
        }
    }
}