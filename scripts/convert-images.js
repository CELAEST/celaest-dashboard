const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Script para convertir imágenes PNG/JPG a WebP de forma recursiva.
 * Optimiza el rendimiento y SEO de la aplicación.
 */

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

async function convertImages() {
  console.log('🚀 Iniciando escaneo de imágenes en /public...');
  
  try {
    const allFiles = await getFiles(PUBLIC_DIR);
    const imageFiles = allFiles.filter(file => 
      /\.(png|jpg|jpeg)$/i.test(file) && !file.includes('node_modules')
    );

    if (imageFiles.length === 0) {
      console.log('ℹ️ No se encontraron imágenes para convertir.');
      return;
    }

    console.log(`📸 Se encontraron ${imageFiles.length} imágenes. Iniciando conversión...`);

    for (const inputPath of imageFiles) {
      const parsedPath = path.parse(inputPath);
      const outputPath = path.format({
        ...parsedPath,
        base: undefined,
        ext: '.webp'
      });

      try {
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
        
        console.log(`✅ ${parsedPath.base} -> ${path.basename(outputPath)}`);
        
        // Descomenta la siguiente línea si deseas borrar los originales automáticamente
        // fs.unlinkSync(inputPath);
      } catch (err) {
        console.error(`❌ Error en ${parsedPath.base}:`, err.message);
      }
    }

    console.log('✨ Proceso finalizado con éxito.');
  } catch (error) {
    console.error('💥 Error crítico durante el proceso:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  convertImages();
}

module.exports = convertImages;
