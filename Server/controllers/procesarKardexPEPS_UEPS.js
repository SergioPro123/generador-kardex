let { clone } = require('./funciones');
//Esta funcion calcula los dos procesos (PEPS y UEPS), segun su segundo parametro
// 0 => PEPS
// 1 => UEPS
let calculaKardexPEPS_UEPS = (datos, PEPS_UEPS) => {
    let i = 1;
    let kardex = {};
    //Recorremos cada una de las operaciones, se realiza el PROMEDIO PONDERADO
    for (const operacion in datos) {
        //Comprobamos que no sea el Inventario Inicial.
        if (operacion === 'inventarioInicial') {
            const cantidadesInventarioInicial = clone(datos[operacion].cantidad);
            const comentariosInventarioFianl = `${datos[operacion].cantidad} * ${datos[operacion].valorUnitario}`;
            kardex[operacion] = {};
            kardex[operacion].saldos = {};
            kardex[operacion].saldos.inventarioActual = {};
            kardex[operacion].saldos.inventarioActual.cantidades = [];
            kardex[operacion].saldos.inventarioActual.cantidades[0] = cantidadesInventarioInicial;
            kardex[operacion].saldos.inventarioActual.comentarios = [];
            kardex[operacion].saldos.inventarioActual.comentarios[0] = comentariosInventarioFianl;
            kardex[operacion].saldos.cantidad = clone(datos[operacion].saldos.cantidad);
            kardex[operacion].saldos.valor = clone(datos[operacion].saldos.valor);
            kardex[operacion].cantidad = clone(datos[operacion].saldos.cantidad);
            kardex[operacion].fecha = clone(datos[operacion].fecha);
            kardex[operacion].descripcion = clone(datos[operacion].descripcion);
            kardex[operacion].valorUnitario = clone(datos[operacion].valorUnitario);
            continue;
        }
        if (datos.hasOwnProperty(operacion)) {
            //De aqui se empieza a procesar cada operacion y a crear la variable 'kardexPromedio'
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
                //Calculamor el inventario actual de la operacion de SALDOS
                kardex[`operacion${i}`].saldos.inventarioActual = {};
                kardex[`operacion${i}`].saldos.inventarioActual.cantidades = [];

                //agregamos los valores que llevabamos en SALDOS de inventario Actual
                kardex[`operacion${i}`].saldos.inventarioActual.cantidades = Object.values(clone(kardex))[
                    i - 1
                ].saldos.inventarioActual.cantidades;
                kardex[`operacion${i}`].saldos.inventarioActual.cantidades[
                    Object.values(clone(kardex))[i].saldos.inventarioActual.cantidades.length
                ] = datos[operacion].cantidad;
                //Agregamos comentarios en SALDOS
                kardex[`operacion${i}`].saldos.inventarioActual.comentarios = [];
                kardex[`operacion${i}`].saldos.inventarioActual.comentarios = Object.values(clone(kardex))[
                    i - 1
                ].saldos.inventarioActual.comentarios;
                kardex[`operacion${i}`].saldos.inventarioActual.comentarios[
                    Object.values(clone(kardex))[i].saldos.inventarioActual.comentarios.length
                ] = `${datos[operacion].cantidad} * ${datos[operacion].valorUnitario}`;
                //console.log(kardexPEPS[`operacion${i}`].saldos.inventarioActual);
            } else {
                //Calculamos la cantidad de SALIDA
                kardex[`operacion${i}`].salida = {};
                kardex[`operacion${i}`].salida.cantidad = datos[operacion].cantidad;

                kardex[`operacion${i}`].saldos = {};

                let inventarioActual = Object.values(clone(kardex))[i - 1].saldos.inventarioActual;

                let cantidadSalida = clone(kardex[`operacion${i}`].salida.cantidad);
                //Actualizamos el inventario actual de Saldos

                kardex[`operacion${i}`].saldos.inventarioActual = {};

                if (PEPS_UEPS === 0) {
                    calcularInventarioActualPEPS(
                        inventarioActual,
                        cantidadSalida,
                        (data, valorSalida, inventario, valorUnitario) => {
                            kardex[`operacion${i}`].salida.unidadesVendidas = data;
                            kardex[`operacion${i}`].salida.valor = valorSalida;

                            kardex[`operacion${i}`].saldos.inventarioActual = inventario;

                            kardex[`operacion${i}`].valorUnitario = [];
                            kardex[`operacion${i}`].valorUnitario = valorUnitario;
                        }
                    );
                } else {
                    calcularInventarioActualUEPS(
                        inventarioActual,
                        cantidadSalida,
                        (data, valorSalida, inventario, valorUnitario) => {
                            kardex[`operacion${i}`].salida.unidadesVendidas = data;
                            kardex[`operacion${i}`].salida.valor = valorSalida;

                            kardex[`operacion${i}`].saldos.inventarioActual = inventario;

                            kardex[`operacion${i}`].valorUnitario = [];
                            kardex[`operacion${i}`].valorUnitario = valorUnitario;
                        }
                    );
                }

                //Calculamos la cantidad de SALDOS
                kardex[`operacion${i}`].saldos.cantidad =
                    parseFloat(Object.values(kardex)[i - 1].saldos.cantidad) - parseFloat(datos[operacion].cantidad);
                //Calculamos el valor de SALDOS
                kardex[`operacion${i}`].saldos.valor =
                    parseFloat(Object.values(kardex)[i - 1].saldos.valor) -
                    parseFloat(kardex[`operacion${i}`].salida.valor);
            }
        }
        i++;
    }
    return kardex;
};

let calcularInventarioActualPEPS = (inventarioActual, cantidadSalida, callback) => {
    let unidadesVendidas = {};
    //Reiniciamos la variable global 'unidadesVendidas'.
    unidadesVendidas.cantidades = [];
    unidadesVendidas.comentarios = [];
    //[0] = valores
    //[1] = comentarios

    let data = Object.values(inventarioActual);
    //Esta variable contiene el valor de la SALIDA
    let valorSalida = 0;
    //La data se devolvera en un Objeto
    let objetoData = {};
    objetoData.cantidades = [];
    objetoData.comentarios = [];

    let valorUnitarioArray = [];
    //Cantidad que vamos a descontar del inventario
    let cantidad = parseFloat(cantidadSalida);
    let ciclo = 0;
    for (let i = 0; i < data[0].length; i++) {
        if (parseFloat(data[0][i]) > cantidad) {
            data[0][i] = parseFloat(data[0][i]) - cantidad;
            let comentario = data[1][i].split(' ');
            data[1][i] = `${data[0][i]} * ${comentario[2]}`;

            valorUnitarioArray[ciclo] = parseFloat(comentario[2]);

            unidadesVendidas.cantidades[ciclo] = cantidad;
            unidadesVendidas.comentarios[ciclo] = `${cantidad} * ${comentario[2]}`;

            valorSalida += cantidad * parseFloat(comentario[2]);

            objetoData.cantidades = data[0];
            objetoData.comentarios = data[1];

            callback(unidadesVendidas, valorSalida, objetoData, valorUnitarioArray);
            return;
        } else if (parseFloat(data[0][i]) < cantidad) {
            cantidad -= parseFloat(data[0][i]);

            let valorUnitario = data[1][i].split(' ');

            valorSalida += parseFloat(data[0][i]) * parseFloat(valorUnitario[2]);

            valorUnitarioArray[ciclo] = parseFloat(valorUnitario[2]);

            unidadesVendidas.cantidades[ciclo] = data[0][i];
            unidadesVendidas.comentarios[ciclo] = data[1][i];
            //Eliminamos del inventario
            data[0].splice(0, 1);
            data[1].splice(0, 1);
            i--;
        } else {
            let valorUnitario = data[1][i].split(' ');

            valorSalida += parseFloat(data[0][i]) * parseFloat(valorUnitario[2]);

            valorUnitarioArray[ciclo] = parseFloat(valorUnitario[2]);

            unidadesVendidas.cantidades[ciclo] = data[0][1];
            unidadesVendidas.comentarios[ciclo] = data[1][1];
            //Eliminamos del inventario
            data[0].splice(0, 1);
            data[1].splice(0, 1);

            objetoData.cantidades = data[0];
            objetoData.comentarios = data[1];
            callback(unidadesVendidas, valorSalida, objetoData, valorUnitarioArray);
            return;
        }
        ciclo++;
    }
};

let calcularInventarioActualUEPS = (inventarioActual, cantidadSalida, callback) => {
    let unidadesVendidas = {};
    //Reiniciamos la variable global 'unidadesVendidas'.
    unidadesVendidas.cantidades = [];
    unidadesVendidas.comentarios = [];
    //[0] = valores
    //[1] = comentarios

    let data = Object.values(inventarioActual);
    //Esta variable contiene el valor de la SALIDA
    let valorSalida = 0;
    //La data se devolvera en un Objeto
    let objetoData = {};
    objetoData.cantidades = [];
    objetoData.comentarios = [];

    let valorUnitarioArray = [];
    //Cantidad que vamos a descontar del inventario
    let cantidad = parseFloat(cantidadSalida);
    let ciclo = 0;
    for (let i = data[0].length - 1; i >= 0; i--) {
        if (parseFloat(data[0][i]) > cantidad) {
            data[0][i] = parseFloat(data[0][i]) - cantidad;
            let comentario = data[1][i].split(' ');
            data[1][i] = `${data[0][i]} * ${comentario[2]}`;

            valorUnitarioArray[ciclo] = parseFloat(comentario[2]);

            unidadesVendidas.cantidades[ciclo] = cantidad;
            unidadesVendidas.comentarios[ciclo] = `${cantidad} * ${comentario[2]}`;

            valorSalida += cantidad * parseFloat(comentario[2]);

            objetoData.cantidades = data[0];
            objetoData.comentarios = data[1];

            callback(unidadesVendidas, valorSalida, objetoData, valorUnitarioArray);
            return;
        } else if (parseFloat(data[0][i]) < cantidad) {
            cantidad -= parseFloat(data[0][i]);

            let valorUnitario = data[1][i].split(' ');

            valorSalida += parseFloat(data[0][i]) * parseFloat(valorUnitario[2]);

            valorUnitarioArray[ciclo] = parseFloat(valorUnitario[2]);

            unidadesVendidas.cantidades[ciclo] = data[0][i];
            unidadesVendidas.comentarios[ciclo] = data[1][i];
            //Eliminamos del inventario
            data[0].splice(i, 1);
            data[1].splice(i, 1);
        } else {
            let valorUnitario = data[1][i].split(' ');

            valorSalida += parseFloat(data[0][i]) * parseFloat(valorUnitario[2]);

            valorUnitarioArray[ciclo] = parseFloat(valorUnitario[2]);

            unidadesVendidas.cantidades[ciclo] = data[0][1];
            unidadesVendidas.comentarios[ciclo] = data[1][1];
            //Eliminamos del inventario
            data[1].splice(i, 1);
            data[0].splice(i, 1);

            objetoData.cantidades = data[0];
            objetoData.comentarios = data[1];

            callback(unidadesVendidas, valorSalida, objetoData, valorUnitarioArray);
            return;
        }
        ciclo++;
    }
};

module.exports = {
    calculaKardexPEPS_UEPS,
};
