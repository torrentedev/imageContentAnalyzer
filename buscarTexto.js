const Tesseract = require('tesseract.js');
const leven = require('leven');

// Ruta a la imagen
const imagePath = 'img/C1.png';

// Función para calcular el porcentaje de similitud
const calcularSimilitud = (texto1, texto2) => {
    const distancia = leven(texto1.toLowerCase(), texto2.toLowerCase());
    const longitudMaxima = Math.max(texto1.length, texto2.length);
    const similitud = ((longitudMaxima - distancia) / longitudMaxima) * 100;
    return Math.max(0, Math.min(similitud.toFixed(2), 100)); // Asegurar que esté entre 0 y 100
};

// Función para buscar texto en la imagen
const buscarTextoEnImagen = async (imagePath, textoBuscado) => {
    try {
        // Ejecutar OCR en la imagen
        const { data: { text } } = await Tesseract.recognize(imagePath, 'spa');

        // Imprimir el texto extraído
        console.log('Texto extraído:', text);

        // Dividir el texto extraído en palabras o segmentos
        const palabras = text.split(/\s+/);

        // Convertir el texto buscado a minúsculas
        const textoBuscadoLower = textoBuscado.toLowerCase();

        // Calcular la longitud del texto buscado en palabras
        const numPalabrasBuscadas = textoBuscadoLower.split(/\s+/).length;

        // Buscar el texto específico en los segmentos de la longitud adecuada y calcular la similitud
        let similitudMaxima = 0;
        for (let i = 0; i <= palabras.length - numPalabrasBuscadas; i++) {
            const segmento = palabras.slice(i, i + numPalabrasBuscadas).join(' ');
            const similitud = calcularSimilitud(segmento, textoBuscadoLower);
            if (similitud > similitudMaxima) {
                similitudMaxima = similitud;
            }
        }

        // Mostrar el resultado
        if (similitudMaxima > 0) {
            console.log(`El texto "${textoBuscado}" tiene una probabilidad del ${similitudMaxima}% de estar en la imagen.`);
        } else {
            console.log(`El texto "${textoBuscado}" no se encontró en la imagen.`);
        }
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
    }
};

// Nombre o número a buscar
const textoBuscado = '8007494';

// Ejecutar la función
buscarTextoEnImagen(imagePath, textoBuscado);
