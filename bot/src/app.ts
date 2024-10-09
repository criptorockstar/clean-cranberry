import { fileURLToPath } from "url"; // Importar para obtener __dirname
import { dirname, join } from "path"; // Importar para manipular rutas
import {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";
import express from "express"; // Importar express
import fs from "fs"; // Importar fs

const PORT = 3008;

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear una instancia de express
const app = express();

// Conexión a la base de datos
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "cranberry",
});

// Servir la carpeta assets
const assetsPath = join(__dirname, "../");
app.use("/qr", express.static(assetsPath));

// Listar archivos en el directorio assets
fs.readdir(assetsPath, (err, files) => {
  if (err) {
    console.error("Error leyendo el directorio:", err);
  } else {
    console.log("Archivos en assets:", files);
  }
});

// Mensaje de Bienvenida
const welcomeFlow = addKeyword(["hola", "Hola"]).addAnswer(
  "Hola, Bienvenido a Cranberry! 💜\n✨Si Querés realizar un pedido y querés sacarte tus dudas, escribí *preventa* en el chat, así obtendrás una lista de las preguntas frecuentes!\n✨ Si ya nos realizaste un pedido y querés obtener información sobre tu pedido, escribí *postventa* en el chat, así obtendrás una lista de las preguntas frecuentes!",
);

// Formulario de Pre-Venta
const welcomeFlow1 = addKeyword(["preventa"]).addAnswer(
  "Por favor, selecciona una opción de la siguiente lista:\n\n1️⃣ Dirección y Horario\n2️⃣ Venta Mayorista\n3️⃣ Medios de Pago\n4️⃣ Envíos y Retiros\n5️⃣ Catálogo y Página web Mayorista\n6️⃣ Tiempo de Demora en Despachar Pedido\n7️⃣ Tabla de Talles",
);

// Formulario de Post-Venta
const welcomeFlow2 = addKeyword(["postventa"]).addAnswer(
  "Por favor, selecciona una opción de la siguiente lista:\n\n8️⃣ Realicé un Pedido por la web y Quiero Abonar!\n9️⃣ Ya Aboné mi Pedido y Quiero Retirar por el Local\n🔟 Estado del Envío\n1️⃣1️⃣ ⁠Quiero ver la Guía de mi Pedido!\n1️⃣2️⃣ Contactar Asesor\n1️⃣3️⃣ Consultar Estado del Envío",
);

// Condicionales
const handleSelectionFlow = addKeyword([
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
]).addAnswer("Procesando...", null, async (ctx: any, { provider }) => {
  try {
    console.log("Mensaje Recibido:", ctx.body);

    let responseMessage = "";
    switch (ctx.body.trim()) {
      case "1":
        responseMessage =
          "Nuestra dirección es Cuenca 497 y Cuenca 683, Flores Capital Federal.\nEstamos de Lunes a Viernes de 08:00 a 16:30\n*Sábados estamos cerrados*\nTE ESPERAMOS! 🖤";
        break;
      case "2":
        responseMessage =
          "Podes realizar tu compra sin cuit o comercio\nOnline: El mínimo es de $100.000 en prendas surtidas.\nLocal: El mínimo es de 5 prendas surtidas.\nO 3 prenda surtidas en nuestra sucursal Cuenca 683 !\nLos esperamos 💜";
        break;
      case "3":
        responseMessage =
          "Online: Los medios de pago son transferencia y/o depósito bancario.\nLocal: Efectivo y transferencia, no aceptamos Mercado Pago (solo opción transferir)";
        break;
      case "4":
        responseMessage =
          "Realizamos envíos a todo el país con todos los transportes 🚚\n*EL ENVÍO LO ABONA EL CLIENTE*\nTambién podés venir y retirar por el local o enviar un comisionista!";
        break;
      case "5":
        responseMessage =
          "Podés ver nuestro único catalogo en nuestra web:\nwww.cranberrymayorista.com";
        break;
      case "6":
        responseMessage =
          "Una vez realizado el pedido y pago del mismo, el pedido será despachado dentro de las 48/72hs.\nPodrás ver el seguimiento por la web!";
        break;
      case "7":
        responseMessage =
          "No tenemos tabla de talles! Pero estamos trabajando para tenerlas muy pronto!\nTe podemos asesorar:\nTalle m Talle 36\nTalle l Talle 38\nTalle xl Talle 40\nTalle xxl Talle 42\nLas prendas que figuran como único talle son talle m/l.";
        break;
      case "8":
        responseMessage =
          "Gracias por tu compra 🤍🤍\nAboná tu pedido al siguiente CBU y envíanos comprobante con tu número de pedido.\nCBU:XXXXXXXXXXXX";
        break;
      case "9":
        responseMessage =
          "Gracias por tu compra, en estos momentos tu pedido está siendo armado, y nos estaremos comunicando para informarte día de retiro.";
        break;
      case "10":
        responseMessage =
          "Gracias por tu compra!\nTu pedido en estos momentos está siendo armado, y nos estaremos comunicando para avisarte si ya fue despachado!\nÓ también podés ver esa info en nuestra web\nwww.cranberrymayorista.com";
        break;
      case "11":
        responseMessage =
          "Tu pedido será despachado dentro de las 72hs de haber realizado tu pago!\nPodés ver tu guía en nuestra web\nIngresa a www.cranberrymayorista.com\nO nos estaremos comunicando para enviarte tu guía!";
        break;
      case "12":
        responseMessage =
          "Tu pedido será despachado dentro de las 72hs de haber realizado tu pago!\nPodés ver tu guía en nuestra web\nIngresa a www.cranberrymayorista.com\nO nos estaremos comunicando para enviarte tu guía!";
        break;
      case "13": {
        interface Order {
          id: number;
          orderNumber: string;
          total: number;
          status: string;
          createdAt: string;
          updatedAt: string;
          shippingAddress: {
            id: number;
            address: string;
            door: string | null;
            zip: string;
            phone: string;
          };
          items: Array<{}>;
          user: {
            id: number;
          };
        }

        const orderNumber = ctx.body.trim().toUpperCase();
        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM orders WHERE orderNumber = ?",
          [orderNumber],
        );

        if (Array.isArray(rows) && rows.length > 0) {
          const order = rows[0]; // Suponiendo que el número de pedido es único
          responseMessage = `Estado de tu pedido *${orderNumber}*:\n\n- Estado: ${order.status}`;
        } else {
          responseMessage = `No se encontró ningún pedido con el número *${orderNumber}*. Verifica el número de pedido e inténtalo de nuevo.`;
        }
        break;
      }
    }

    await provider.sendMessage(ctx.from, responseMessage, {});
  } catch (error) {
    console.error("Error procesando el mensaje:", error);
  }
});

// Flows
const main = async () => {
  const adapterFlow = createFlow([
    welcomeFlow,
    welcomeFlow1,
    handleSelectionFlow,
    welcomeFlow2,
  ]);
  const adapterProvider = createProvider(Provider);
  const adapterDB = new Database();

  const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  httpServer(+PORT);
};

main();
