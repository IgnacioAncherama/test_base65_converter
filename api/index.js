const sharp = require('sharp');

export default async function handler(req, res) {
  // 1. Solo aceptamos método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permite POST' });
  }

  try {
    const { image_base64 } = req.body;

    if (!image_base64) {
      return res.status(400).json({ error: 'Falta la imagen' });
    }

    // 2. Limpiamos el texto por si trae la cabecera de HTML
    const base64Data = image_base64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // 3. Comprimimos la imagen (Ancho 800px, Calidad 60%)
    const compressedBuffer = await sharp(imageBuffer)
      .resize({ width: 800, withoutEnlargement: true }) 
      .jpeg({ quality: 60 }) 
      .toBuffer();

    // 4. Devolvemos el resultado listo para Power Automate
    res.status(200).json({
      success: true,
      resized_base64: compressedBuffer.toString('base64')
    });

  } catch (error) {
    res.status(500).json({ error: 'Error procesando la imagen' });
  }
}
