const excelJS = require('exceljs');

const workbook = new excelJS.Workbook();
workbook.creator = 'Sergio Aparicio';
workbook.created = new Date();

let nombreHojas = ['PROMEDIO', 'PEPS', 'UEPS'];
let tamanioColumnas = [13, 33, 12, 14, 14, 8, 15, 15, 8, 15, 15, 8];

var numeroOperaciones = 0;
//Construimos el archivo excel
let generarExcelKardex = (kardexPromedio, kardexPEPS, kardexUEPS, totalesKardex) => {
    let kardexs = [kardexPromedio, kardexPEPS, kardexUEPS];
    let nombreTotales = ['kardexPromedio', 'kardexPEPS', 'kardexUEPS'];
    //Obtenemos la longitudad de los karde o numero de operaciones
    for (operacion in kardexPromedio) {
        numeroOperaciones++;
    }
    for (i = 0; i < 3; i++) {
        //Creamos una nueva hoja
        const sheet = workbook.addWorksheet(nombreHojas[i]);
        //Centramos celdas
        alignmentCells(sheet);
        //Damos tamaño a las columnas de cada hoja
        for (let i = 1; i <= tamanioColumnas.length; i++) {
            sheet.getColumn(i).width = tamanioColumnas[i - 1];
        }

        //sheet.getCell().fill.bgColor;
        crearEncabezadoExcel(sheet);
        inclustarInformacion(sheet, kardexs[i], totalesKardex, nombreTotales[i]);
    }

    // save workbook to disk
    workbook.xlsx.writeFile('Kardex.xlsx').then(function () {
        console.log('saved');
    });
};
//Esta funcion se encargara de pasar las variable que contiene la informacion
//de los kardex a excel.
let inclustarInformacion = (sheet, kardex, totalesKardex, nombreTotales) => {
    //La variable 'i' indica el numero de fila en el que iniciara.
    let i = 12;
    //console.log(kardex);
    for (const operacion in kardex) {
        if (kardex.hasOwnProperty(operacion)) {
            sheet.getCell('A' + i).value = kardex[operacion].fecha;
            //preguntamos si es el inventario inicial, ya que este no contiene la propiedad 'tipoOperacion'
            if (operacion === 'inventarioInicial') {
                sheet.getCell('B' + i).value = kardex[operacion].descripcion;
            } else {
                sheet.getCell('B' + i).value =
                    kardex[operacion].tipoOperacion.charAt(0).toUpperCase() +
                    kardex[operacion].tipoOperacion.substring(1) +
                    ' : ' +
                    kardex[operacion].descripcion;
            }

            //Preguntamos si la propiedad 'valorUnitario' es un array, si es asi
            //Entonces es por que contiene mas de un valor unitario
            if (Array.isArray(kardex[operacion].valorUnitario)) {
                let longitud = Object.values(kardex)[i - 12].valorUnitario.length;
                let msj = '';
                for (let j = 0; j < longitud; j++) {
                    msj += ' \n ' + kardex[operacion].valorUnitario[j];
                }
                sheet.getCell('C' + i).value = msj;
            } else {
                sheet.getCell('C' + i).value = kardex[operacion].valorUnitario;
            }
            //Preguntamos si exite la propiedad 'entrada'
            if (kardex[operacion].hasOwnProperty('entrada')) {
                sheet.getCell('D' + i).value = kardex[operacion].entrada.cantidad;
                sheet.getCell('E' + i).value = kardex[operacion].entrada.valor;
            }
            //Añadimos el efecto al borde derecho
            sheet.getCell('E' + i).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'mediumDashDot' },
            };
            //Añadimos el efecto al borde derecho
            sheet.getCell('H' + i).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'mediumDashDot' },
            };
            //Añadimos el efecto al borde derecho
            sheet.getCell('K' + i).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'mediumDashDot' },
            };
            //Preguntamos si exite la propiedad 'salida'
            if (kardex[operacion].hasOwnProperty('salida')) {
                sheet.getCell('G' + i).value = kardex[operacion].salida.cantidad;
                sheet.getCell('H' + i).value = kardex[operacion].salida.valor;

                //Preguntamos si exite la propiedad 'unidadesVendidas'
                if (kardex[operacion].salida.hasOwnProperty('unidadesVendidas')) {
                    let longitud = Object.values(kardex)[i - 12].salida.unidadesVendidas.cantidades.length;
                    let msj = '';
                    for (let j = 0; j < longitud; j++) {
                        msj += ' \n ' + kardex[operacion].salida.unidadesVendidas.cantidades[j];
                    }
                    sheet.getCell('I' + i).value = msj;

                    //---------------------------Tenemos que agregar el comentario
                    msj = '';
                    for (let j = 0; j < longitud; j++) {
                        msj += ' \n ' + kardex[operacion].salida.unidadesVendidas.comentarios[j];
                    }
                    // plain text note
                    sheet.getCell('I' + i).note = msj;
                }
            }
            sheet.getCell('J' + i).value = kardex[operacion].saldos.cantidad;
            sheet.getCell('K' + i).value = kardex[operacion].saldos.valor;
            //Preguntamos si exite la propiedad 'inventarioActual'
            if (kardex[operacion].saldos.hasOwnProperty('inventarioActual')) {
                let longitud = Object.values(kardex)[i - 12].saldos.inventarioActual.cantidades.length;
                let msj = '';
                for (let j = 0; j < longitud; j++) {
                    msj += ' \n ' + kardex[operacion].saldos.inventarioActual.cantidades[j];
                }
                sheet.getCell('L' + i).value = msj;
                //---------------------------Tenemos que agregar el comentario
                msj = '';
                for (let j = 0; j < longitud; j++) {
                    msj += ' \n ' + kardex[operacion].saldos.inventarioActual.comentarios[j];
                }
                // plain text note
                sheet.getCell('L' + i).note = msj;
            }
        }
        i++;
    }
    //Concluimos rellenando los totales
    inclustarTotales(sheet, totalesKardex, nombreTotales, i);
};

let inclustarTotales = (sheet, totalesKardex, nombreTotales, i) => {
    sheet.getCell('D' + i).value = totalesKardex[nombreTotales].compras.cantidad;
    sheet.getCell('E' + i).value = totalesKardex[nombreTotales].compras.valor;
    colorCeldas(sheet, 'D' + i);
    colorCeldas(sheet, 'E' + i);
    sheet.mergeCells(`D${i + 1}:E${i + 1}`);
    sheet.getCell('D' + (i + 1)).value = 'COMPRAS';
    colorCeldas(sheet, 'D' + (i + 1));

    sheet.getCell('G' + i).value = totalesKardex[nombreTotales].costoMateriales.cantidad;
    sheet.getCell('H' + i).value = totalesKardex[nombreTotales].costoMateriales.valor;
    colorCeldas(sheet, 'G' + i);
    colorCeldas(sheet, 'H' + i);
    sheet.mergeCells(`G${i + 1}:H${i + 1}`);
    sheet.getCell('G' + (i + 1)).value = 'COSTO MATERIALES';
    colorCeldas(sheet, 'G' + (i + 1));

    sheet.getCell('J' + i).value = totalesKardex[nombreTotales].inventarioFinal.cantidad;
    sheet.getCell('K' + i).value = totalesKardex[nombreTotales].inventarioFinal.valor;
    colorCeldas(sheet, 'J' + i);
    colorCeldas(sheet, 'K' + i);
    sheet.mergeCells(`J${i + 1}:K${i + 1}`);
    sheet.getCell('J' + (i + 1)).value = 'INVENTARIO FINAL MATERIALES';
    colorCeldas(sheet, 'J' + (i + 1));
};

let crearEncabezadoExcel = (sheet) => {
    bold(sheet, 'A1');
    sheet.mergeCells('A1:L1');
    sheet.getCell('A1').value = 'EMPRESA XXXXX';
    sheet.mergeCells('A2:L2');
    sheet.getCell('A2').value = 'NIT. XXX.XXX.XXX-X';
    sheet.mergeCells('A3:L3');
    sheet.getCell('A3').value = 'KARDEX';
    bold(sheet, 'H4');
    sheet.mergeCells('H4:J4');
    sheet.getCell('H4').value = 'VALORACIÓN';
    sheet.getCell('A5').value = 'Articulo';
    sheet.mergeCells('B5:F5');
    sheet.getCell('G5').value = 'Referencia';
    sheet.mergeCells('H5:L5');
    sheet.getCell('A6').value = 'Localizacion';
    sheet.mergeCells('B6:C6');
    sheet.getCell('D6').value = 'Unidad';
    sheet.mergeCells('E6:F6');
    sheet.getCell('G6').value = 'Minimo';
    sheet.mergeCells('H6:I6');
    sheet.getCell('J6').value = 'Maximo';
    sheet.mergeCells('K6:L6');
    sheet.getCell('A7').value = 'Proveedores';
    sheet.mergeCells('B7:L7');
    sheet.mergeCells('A8:L9');

    //Empezamos a crear la parte superior de la tabla
    sheet.getCell('A10').value = 'Fecha';
    bold(sheet, 'A10');
    colorCeldas(sheet, 'A10');
    sheet.mergeCells('B10:B11');
    sheet.getCell('B10').value = 'Detalle';
    bold(sheet, 'B10');
    colorCeldas(sheet, 'B10');
    sheet.mergeCells('C10:C11');
    sheet.getCell('C10').value = 'Valor Unitario';
    bold(sheet, 'C10');
    colorCeldas(sheet, 'C10');
    sheet.mergeCells('D10:F10');
    sheet.getCell('D10').value = 'Entradas';
    bold(sheet, 'D10');
    colorCeldas(sheet, 'D10');
    sheet.mergeCells('G10:I10');
    sheet.getCell('G10').value = 'Salidas';
    bold(sheet, 'G10');
    colorCeldas(sheet, 'G10');
    sheet.mergeCells('J10:L10');
    sheet.getCell('J10').value = 'Saldos';
    bold(sheet, 'J10');
    colorCeldas(sheet, 'J10');

    sheet.getCell('A11').value = 'dd/mm/aaaa';
    sheet.getCell('D11').value = 'Cantidad';
    sheet.getCell('E11').value = 'Valores';
    sheet.mergeCells('E11:F11');
    sheet.getCell('G11').value = 'Cantidad';
    sheet.getCell('H11').value = 'Valores';
    sheet.mergeCells('H11:I11');
    sheet.getCell('J11').value = 'Cantidad';
    sheet.getCell('K11').value = 'Valores';
    sheet.mergeCells('K11:L11');

    return;
};
let colorCeldas = (sheet, cell) => {
    sheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFA6A6A6' },
        bgColor: { argb: 'FFFFFFFF' },
    };
};
let alignmentCells = (sheet) => {
    let letrasColumna = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    //Columna
    for (let i = 1; i <= 12; i++) {
        //fila
        for (let j = 1; j <= 300; j++) {
            sheet.getCell(`${letrasColumna[i - 1]}${j}`).alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true,
            };
            //Damos borde
            if (j < numeroOperaciones + 12) {
                bordeCell(sheet, `${letrasColumna[i - 1]}${j}`);
            }
        }
    }
    //Damos borde a los totales
    bordeCell(sheet, 'D' + (numeroOperaciones + 12));
    bordeCell(sheet, 'E' + (numeroOperaciones + 12));
    bordeCell(sheet, 'G' + (numeroOperaciones + 12));
    bordeCell(sheet, 'H' + (numeroOperaciones + 12));
    bordeCell(sheet, 'J' + (numeroOperaciones + 12));
    bordeCell(sheet, 'K' + (numeroOperaciones + 12));

    bordeCell(sheet, 'D' + (numeroOperaciones + 13));
    bordeCell(sheet, 'G' + (numeroOperaciones + 13));
    bordeCell(sheet, 'J' + (numeroOperaciones + 13));
};

let bordeCell = (sheet, cell) => {
    sheet.getCell(cell).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
};

let bold = (sheet, cell) => {
    sheet.getCell(cell).font = {
        bold: true,
    };
};
module.exports = {
    generarExcelKardex,
};
