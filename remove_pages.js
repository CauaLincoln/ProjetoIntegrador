const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function removePages() {
  const pdfPath = 'C:\\\\Users\\\\caua.lincoln\\\\Downloads\\\\Projeto-Integrador-main\\\\Projeto_Integrador_Refatorado_V2.pdf';
  const existingPdfBytes = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
  const totalPages = pdfDoc.getPageCount();
  console.log(`Documento original tem: ${totalPages} páginas.`);

  // Note: removePage shifts the indices, so we remove from Highest to Lowest!
  // Remove Page 27 (index 26)
  if (totalPages >= 27) {
    pdfDoc.removePage(26);
    console.log("Página 27 removida.");
  } else {
    console.log("Documento tem menos de 27 páginas, ignorando remoção da pág 27.");
  }
  
  // Remove Page 2 (index 1)
  if (totalPages >= 2) {
    pdfDoc.removePage(1);
    console.log("Página 2 removida.");
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);
  console.log('Documento atualizado com sucesso. Páginas removidas!');
}

removePages().catch(console.error);
