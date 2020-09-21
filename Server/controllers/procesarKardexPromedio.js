let { clone } = require('./funciones');

let calculaKardexPromedio = (datos) => {
    let i = 1;
    let kardex = {};
    //Recorremos cada una de las operaciones, se realiza el PROMEDIO PONDERADO
    for (const operacion in datos) {
        //Comprobamos que no sea el Inventario Inicial.
        if (operacion == 'inventarioInicial') {
            datos[operacion].saldos = {};
            //Asignamos la cantidad de SALDOS
            datos[operacion].saldos.cantidad = datos[operacion].cantidad;
            //Calculamos el valor de SALDOS.
            datos[operacion].saldos.valor =
                parseFloat(datos[operacion].valorUnitario) * parseFloat(datos[operacion].cantidad);
            kardex[operacion] = {};
            kardex[operacion].saldos = {};
            kardex[operacion].saldos.cantidad = clone(datos[operacion].saldos.cantidad);
            kardex[operacion].saldos.valor = clone(datos[operacion].saldos.valor);

            continue;
        }
        if (datos.hasOwnProperty(operacion)) {
            //De aqui se empieza a procesar cada operacion y a crear la variable 'kardex'
            kardex[`operacion${i}`] = {};
            kardex[`operacion${i}`].fecha = datos[operacion].fecha;
            kardex[`operacion${i}`].descripcion = datos[operacion].descripcion;
            kardex[`operacion${i}`].tipoOperacion = datos[operacion].tipoOperacion;
            if (datos[operacion].tipoOperacion === 'compra') {
                //Asignamos el valor unitario
                kardex[`operacion${i}`].valorUnitario = datos[operacion].valorUnitario;
                kardex[`operacion${i}`].entrada = {};
                //Calculamos la cantidad de ENTRADA
                kardex[`operacion${i}`].entrada.cantidad = datos[operacion].cantidad;
                //Calculamos el valor de ENTRADA = cantidad * valor unitario
                kardex[`operacion${i}`].entrada.valor =
                    parseFloat(datos[operacion].cantidad) * parseFloat(datos[operacion].valorUnitario);
                kardex[`operacion${i}`].saldos = {};
                //Calculamos la cantidad de SALDOS
                kardex[`operacion${i}`].saldos.cantidad =
                    parseFloat(Object.values(clone(kardex))[i - 1].saldos.cantidad) +
                    parseFloat(datos[operacion].cantidad);
                //Calculamos el valor de SALDOS
                kardex[`operacion${i}`].saldos.valor =
                    parseFloat(Object.values(clone(kardex))[i - 1].saldos.valor) +
                    parseFloat(kardex[`operacion${i}`].entrada.valor);
            } else {
                //Calculamos el valor unitario = SALDOS Anterior: valor / cantidad
                kardex[`operacion${i}`].valorUnitario =
                    parseFloat(Object.values(clone(kardex))[i - 1].saldos.valor) /
                    parseFloat(Object.values(clone(kardex))[i - 1].saldos.cantidad);
                kardex[`operacion${i}`].salida = {};
                //Calculamos la cantidad de SALIDA
                kardex[`operacion${i}`].salida.cantidad = datos[operacion].cantidad;
                //Calculamos el valor de SALIDA = cantidad * valor unitario
                kardex[`operacion${i}`].salida.valor =
                    parseFloat(datos[operacion].cantidad) * parseFloat(kardex[`operacion${i}`].valorUnitario);
                kardex[`operacion${i}`].saldos = {};
                //Calculamos la cantidad de SALDOS
                kardex[`operacion${i}`].saldos.cantidad =
                    parseFloat(Object.values(kardex)[i - 1].saldos.cantidad) - parseFloat(datos[operacion].cantidad);
                //Calculamos el valor de SALDOS
                kardex[`operacion${i}`].saldos.valor =
                    parseFloat(Object.values(clone(kardex))[i - 1].saldos.valor) -
                    parseFloat(kardex[`operacion${i}`].salida.valor);
            }
        }
        i++;
    }

    return kardex;
};

module.exports = {
    calculaKardexPromedio,
};
