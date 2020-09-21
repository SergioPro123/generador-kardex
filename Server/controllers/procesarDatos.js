/*
Esta funcion se encargara de procesar los datos enviados por el cliente,
se recibira un objeto con la siguiente estructura:
{
    inventarioInicial:{
        cantidad,
        descripcion,
        fecha,
        valorUnitario
    },
    operacion#:{
        cantidad,
        descripcion,
        fecha,
        tipoOperacion,
        valorUnitario
    },
    operacion#...
}

Al final del proceso, se debe obtener 3 variables de tipo Objeto, con la siguiente estructura:
--------------------------------------------------------
Pomedio{
    inventarioInicial:{
        cantidad,
        descripcion,
        fecha,
        valorUnitario,
        saldos:{
           cantidad,
            valores 
        }
    },
    operacion#:{                        <---------- Si es tipo COMPRA
        fecha,
        descripcion,
        tipoOperacion,                    
        valorUnitario,
        entrada:{
            cantidad,
            valor
        },
        saldos:{
           cantidad,
            valores 
        }
    },
    operacion#:{                        <---------- Si es tipo Venta
        fecha,
        descripcion,
        tipoOperacion,                    
        valorUnitario,
        salida:{
            cantidad,
            valor
        },
        saldos:{
           cantidad,
            valores 
        }
    },
    operacion#...
}
------------------------------------------------------------------------
PEPS,UEPS{
    inventarioInicial:{
        cantidad,
        descripcion,
        fecha,
        valorUnitario,
        saldos:{
           cantidad,
            valores 
        }
    },
    operacion#:{                        <---------- Si es tipo COMPRA
        fecha,
        descripcion,
        tipoOperacion,                    
        valorUnitario,
        entrada:{
            cantidad,
            valor
        },
        saldos:{
            cantidad,
            valores,
            inventarioActual{
              cantidades:[],
              comentario:[]
            }
        }
    },
    operacion#:{                        <---------- Si es tipo Venta
        fecha,
        descripcion,
        tipoOperacion,                    
        valorUnitario:[],
        salida:{
            cantidad,
            valor,
            unidadesVendidas:{
                cantidades:[],
                comentarios:[]
            }
        },
        saldos:{
           cantidad,
            valores,
            inventarioActual{
              cantidades:[],
              comentarios:[]
            } 
        }
    },
    operacion#...
}
------------------------------------------------------------------------
totalesKardex:{
    promedio,PEPS,UEPS:{
        compras:{
            cantidad,
            valor
        },
        costoMateriales:{
            cantidad,
            valor
        },
        inventarioFinal:{
            cantidad,
            valor
        }
    }
}
 */
'use strict';
//Esta variable tipo Objeto, contendremos los varoles del Kardex en el Promedio Ponderado
var kardexPromedio = new Object();
//Esta variable tipo Objeto, contendremos los varoles del Kardex en el PEPS
var kardexPEPS = new Object();
//Esta variable tipo Objeto, contendremos los varoles del Kardex en el UEPS
var kardexUEPS = new Object();
//Esta variable tipo Objeto, contendremos los varoles totales de cada Kardex
var totalesKardex = new Object();

let procesarDatos = (req, res) => {
    let datos = new Object();
    datos = req.body;
    //llenamos el inventario inicial, el cual no cambia
    kardexPromedio.inventarioInicial = clone(datos.inventarioInicial);
    kardexPEPS.inventarioInicial = clone(datos.inventarioInicial);
    kardexUEPS.inventarioInicial = clone(datos.inventarioInicial);

    //Procesamos el kardex PROMEDIO PONDERADO
    calculaKardexPromedio(datos);
    //Procesamos el kardex PEPS
    calculaKardexPEPS(datos);
    //Procesamos el kardex UEPS
    calculaKardexUEPS(datos);

    console.log(JSON.stringify(kardexUEPS, null, 4));

    res.sendStatus(200);
};

let calculaKardexUEPS = (datos) => {
    let i = 1;
    //Recorremos cada una de las operaciones, se realiza el PROMEDIO PONDERADO
    for (const operacion in datos) {
        //Comprobamos que no sea el Inventario Inicial.
        if (operacion === 'inventarioInicial') {
            const cantidadesInventarioInicial = clone(datos[operacion].cantidad);
            const comentariosInventarioFianl = `${datos[operacion].cantidad} * ${datos[operacion].valorUnitario}`;

            kardexUEPS[operacion].saldos = {};
            kardexUEPS[operacion].saldos.inventarioActual = {};
            kardexUEPS[operacion].saldos.inventarioActual.cantidades = [];
            kardexUEPS[operacion].saldos.inventarioActual.cantidades[0] = cantidadesInventarioInicial;
            kardexUEPS[operacion].saldos.inventarioActual.comentarios = [];
            kardexUEPS[operacion].saldos.inventarioActual.comentarios[0] = comentariosInventarioFianl;
            kardexUEPS[operacion].saldos.cantidad = clone(datos[operacion].saldos.cantidad);
            kardexUEPS[operacion].saldos.valor = clone(datos[operacion].saldos.valor);
            continue;
        }
        if (datos.hasOwnProperty(operacion)) {
            //De aqui se empieza a procesar cada operacion y a crear la variable 'kardexPromedio'
            kardexUEPS[`operacion${i}`] = {};
            kardexUEPS[`operacion${i}`].fecha = datos[operacion].fecha;
            kardexUEPS[`operacion${i}`].descripcion = datos[operacion].descripcion;
            kardexUEPS[`operacion${i}`].tipoOperacion = datos[operacion].tipoOperacion;
            if (datos[operacion].tipoOperacion === 'compra') {
                //Asignamos el valor unitario
                kardexUEPS[`operacion${i}`].valorUnitario = datos[operacion].valorUnitario;
                kardexUEPS[`operacion${i}`].entrada = {};
                //Calculamos la cantidad de ENTRADA
                kardexUEPS[`operacion${i}`].entrada.cantidad = datos[operacion].cantidad;
                //Calculamos el valor de ENTRADA = cantidad * valor unitario
                kardexUEPS[`operacion${i}`].entrada.valor =
                    parseFloat(datos[operacion].cantidad) * parseFloat(datos[operacion].valorUnitario);
                kardexUEPS[`operacion${i}`].saldos = {};
                //Calculamos la cantidad de SALDOS
                kardexUEPS[`operacion${i}`].saldos.cantidad =
                    parseFloat(Object.values(clone(kardexUEPS))[i - 1].saldos.cantidad) +
                    parseFloat(datos[operacion].cantidad);
                //Calculamos el valor de SALDOS
                kardexUEPS[`operacion${i}`].saldos.valor =
                    parseFloat(Object.values(clone(kardexUEPS))[i - 1].saldos.valor) +
                    parseFloat(kardexUEPS[`operacion${i}`].entrada.valor);
                //Calculamor el inventario actual de la operacion de SALDOS
                kardexUEPS[`operacion${i}`].saldos.inventarioActual = {};
                kardexUEPS[`operacion${i}`].saldos.inventarioActual.cantidades = [];

                //agregamos los valores que llevabamos en SALDOS de inventario Actual
                kardexUEPS[`operacion${i}`].saldos.inventarioActual.cantidades = Object.values(clone(kardexUEPS))[
                    i - 1
                ].saldos.inventarioActual.cantidades;

                kardexUEPS[`operacion${i}`].saldos.inventarioActual.cantidades[
                    Object.values(clone(kardexUEPS))[i].saldos.inventarioActual.cantidades.length
                ] = datos[operacion].cantidad;
                //Agregamos comentarios en SALDOS
                kardexUEPS[`operacion${i}`].saldos.inventarioActual.comentarios = [];
                kardexUEPS[`operacion${i}`].saldos.inventarioActual.comentarios = Object.values(clone(kardexUEPS))[
                    i - 1
                ].saldos.inventarioActual.comentarios;
                kardexUEPS[`operacion${i}`].saldos.inventarioActual.comentarios[
                    Object.values(clone(kardexUEPS))[i].saldos.inventarioActual.comentarios.length
                ] = `${datos[operacion].cantidad} * ${datos[operacion].valorUnitario}`;
                console.log(Object.values(clone(kardexUEPS))[i].saldos.inventarioActual);
            } else {
                //Calculamos la cantidad de SALIDA
                kardexUEPS[`operacion${i}`].salida = {};
                kardexUEPS[`operacion${i}`].salida.cantidad = datos[operacion].cantidad;

                kardexUEPS[`operacion${i}`].saldos = {};

                let inventarioActual = Object.values(clone(kardexUEPS))[i - 1].saldos.inventarioActual;

                let cantidadSalida = clone(kardexUEPS[`operacion${i}`].salida.cantidad);
                //Actualizamos el inventario actual de Saldos

                kardexUEPS[`operacion${i}`].saldos.inventarioActual = {};
                calcularInventarioActualUEPS(
                    inventarioActual,
                    cantidadSalida,
                    (data, valorSalida, inventario, valorUnitario) => {
                        kardexUEPS[`operacion${i}`].salida.unidadesVendidas = data;
                        kardexUEPS[`operacion${i}`].salida.valor = valorSalida;

                        kardexUEPS[`operacion${i}`].saldos.inventarioActual = inventario;

                        kardexUEPS[`operacion${i}`].valorUnitario = [];
                        kardexUEPS[`operacion${i}`].valorUnitario = valorUnitario;
                    }
                );
                //Calculamos la cantidad de SALDOS
                kardexUEPS[`operacion${i}`].saldos.cantidad =
                    parseFloat(Object.values(kardexUEPS)[i - 1].saldos.cantidad) -
                    parseFloat(datos[operacion].cantidad);
                //Calculamos el valor de SALDOS
                kardexUEPS[`operacion${i}`].saldos.valor =
                    parseFloat(Object.values(kardexUEPS)[i - 1].saldos.valor) -
                    parseFloat(kardexUEPS[`operacion${i}`].salida.valor);
            }
        }
        i++;
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

let calculaKardexPEPS = (datos) => {
    let i = 1;
    //Recorremos cada una de las operaciones, se realiza el PROMEDIO PONDERADO
    for (const operacion in datos) {
        //Comprobamos que no sea el Inventario Inicial.
        if (operacion === 'inventarioInicial') {
            const cantidadesInventarioInicial = clone(datos[operacion].cantidad);
            const comentariosInventarioFianl = `${datos[operacion].cantidad} * ${datos[operacion].valorUnitario}`;

            kardexPEPS[operacion].saldos = {};
            kardexPEPS[operacion].saldos.inventarioActual = {};
            kardexPEPS[operacion].saldos.inventarioActual.cantidades = [];
            kardexPEPS[operacion].saldos.inventarioActual.cantidades[0] = cantidadesInventarioInicial;
            kardexPEPS[operacion].saldos.inventarioActual.comentarios = [];
            kardexPEPS[operacion].saldos.inventarioActual.comentarios[0] = comentariosInventarioFianl;
            kardexPEPS[operacion].saldos.cantidad = clone(datos[operacion].saldos.cantidad);
            kardexPEPS[operacion].saldos.valor = clone(datos[operacion].saldos.valor);
            continue;
        }
        if (datos.hasOwnProperty(operacion)) {
            //De aqui se empieza a procesar cada operacion y a crear la variable 'kardexPromedio'
            kardexPEPS[`operacion${i}`] = {};
            kardexPEPS[`operacion${i}`].fecha = datos[operacion].fecha;
            kardexPEPS[`operacion${i}`].descripcion = datos[operacion].descripcion;
            kardexPEPS[`operacion${i}`].tipoOperacion = datos[operacion].tipoOperacion;
            if (datos[operacion].tipoOperacion === 'compra') {
                //Asignamos el valor unitario
                kardexPEPS[`operacion${i}`].valorUnitario = datos[operacion].valorUnitario;
                kardexPEPS[`operacion${i}`].entrada = {};
                //Calculamos la cantidad de ENTRADA
                kardexPEPS[`operacion${i}`].entrada.cantidad = datos[operacion].cantidad;
                //Calculamos el valor de ENTRADA = cantidad * valor unitario
                kardexPEPS[`operacion${i}`].entrada.valor =
                    parseFloat(datos[operacion].cantidad) * parseFloat(datos[operacion].valorUnitario);
                kardexPEPS[`operacion${i}`].saldos = {};
                //Calculamos la cantidad de SALDOS
                kardexPEPS[`operacion${i}`].saldos.cantidad =
                    parseFloat(Object.values(clone(kardexPEPS))[i - 1].saldos.cantidad) +
                    parseFloat(datos[operacion].cantidad);
                //Calculamos el valor de SALDOS
                kardexPEPS[`operacion${i}`].saldos.valor =
                    parseFloat(Object.values(clone(kardexPEPS))[i - 1].saldos.valor) +
                    parseFloat(kardexPEPS[`operacion${i}`].entrada.valor);
                //Calculamor el inventario actual de la operacion de SALDOS
                kardexPEPS[`operacion${i}`].saldos.inventarioActual = {};
                kardexPEPS[`operacion${i}`].saldos.inventarioActual.cantidades = [];

                //agregamos los valores que llevabamos en SALDOS de inventario Actual
                kardexPEPS[`operacion${i}`].saldos.inventarioActual.cantidades = Object.values(clone(kardexPEPS))[
                    i - 1
                ].saldos.inventarioActual.cantidades;
                kardexPEPS[`operacion${i}`].saldos.inventarioActual.cantidades[
                    Object.values(clone(kardexPEPS))[i].saldos.inventarioActual.cantidades.length
                ] = datos[operacion].cantidad;
                //Agregamos comentarios en SALDOS
                kardexPEPS[`operacion${i}`].saldos.inventarioActual.comentarios = [];
                kardexPEPS[`operacion${i}`].saldos.inventarioActual.comentarios = Object.values(clone(kardexPEPS))[
                    i - 1
                ].saldos.inventarioActual.comentarios;
                kardexPEPS[`operacion${i}`].saldos.inventarioActual.comentarios[
                    Object.values(clone(kardexPEPS))[i].saldos.inventarioActual.comentarios.length
                ] = `${datos[operacion].cantidad} * ${datos[operacion].valorUnitario}`;
                //console.log(kardexPEPS[`operacion${i}`].saldos.inventarioActual);
            } else {
                //Calculamos la cantidad de SALIDA
                kardexPEPS[`operacion${i}`].salida = {};
                kardexPEPS[`operacion${i}`].salida.cantidad = datos[operacion].cantidad;

                kardexPEPS[`operacion${i}`].saldos = {};

                let inventarioActual = Object.values(clone(kardexPEPS))[i - 1].saldos.inventarioActual;

                let cantidadSalida = clone(kardexPEPS[`operacion${i}`].salida.cantidad);
                //Actualizamos el inventario actual de Saldos

                kardexPEPS[`operacion${i}`].saldos.inventarioActual = {};
                calcularInventarioActualPEPS(
                    inventarioActual,
                    cantidadSalida,
                    (data, valorSalida, inventario, valorUnitario) => {
                        kardexPEPS[`operacion${i}`].salida.unidadesVendidas = data;
                        kardexPEPS[`operacion${i}`].salida.valor = valorSalida;

                        kardexPEPS[`operacion${i}`].saldos.inventarioActual = inventario;

                        kardexPEPS[`operacion${i}`].valorUnitario = [];
                        kardexPEPS[`operacion${i}`].valorUnitario = valorUnitario;
                    }
                );

                //Calculamos la cantidad de SALDOS
                kardexPEPS[`operacion${i}`].saldos.cantidad =
                    parseFloat(Object.values(kardexPEPS)[i - 1].saldos.cantidad) -
                    parseFloat(datos[operacion].cantidad);
                //Calculamos el valor de SALDOS
                kardexPEPS[`operacion${i}`].saldos.valor =
                    parseFloat(Object.values(kardexPEPS)[i - 1].saldos.valor) -
                    parseFloat(kardexPEPS[`operacion${i}`].salida.valor);
            }
        }
        i++;
    }
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

let calculaKardexPromedio = (datos) => {
    let i = 1;
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

            kardexPromedio[operacion].saldos = {};
            kardexPromedio[operacion].saldos.cantidad = clone(datos[operacion].saldos.cantidad);
            kardexPromedio[operacion].saldos.valor = clone(datos[operacion].saldos.valor);

            continue;
        }
        if (datos.hasOwnProperty(operacion)) {
            //De aqui se empieza a procesar cada operacion y a crear la variable 'kardexPromedio'
            kardexPromedio[`operacion${i}`] = {};
            kardexPromedio[`operacion${i}`].fecha = datos[operacion].fecha;
            kardexPromedio[`operacion${i}`].descripcion = datos[operacion].descripcion;
            kardexPromedio[`operacion${i}`].tipoOperacion = datos[operacion].tipoOperacion;
            if (datos[operacion].tipoOperacion === 'compra') {
                //Asignamos el valor unitario
                kardexPromedio[`operacion${i}`].valorUnitario = datos[operacion].valorUnitario;
                kardexPromedio[`operacion${i}`].entrada = {};
                //Calculamos la cantidad de ENTRADA
                kardexPromedio[`operacion${i}`].entrada.cantidad = datos[operacion].cantidad;
                //Calculamos el valor de ENTRADA = cantidad * valor unitario
                kardexPromedio[`operacion${i}`].entrada.valor =
                    parseFloat(datos[operacion].cantidad) * parseFloat(datos[operacion].valorUnitario);
                kardexPromedio[`operacion${i}`].saldos = {};
                //Calculamos la cantidad de SALDOS
                kardexPromedio[`operacion${i}`].saldos.cantidad =
                    parseFloat(Object.values(clone(kardexPromedio))[i - 1].saldos.cantidad) +
                    parseFloat(datos[operacion].cantidad);
                //Calculamos el valor de SALDOS
                kardexPromedio[`operacion${i}`].saldos.valor =
                    parseFloat(Object.values(clone(kardexPromedio))[i - 1].saldos.valor) +
                    parseFloat(kardexPromedio[`operacion${i}`].entrada.valor);
            } else {
                //Calculamos el valor unitario = SALDOS Anterior: valor / cantidad
                kardexPromedio[`operacion${i}`].valorUnitario =
                    parseFloat(Object.values(clone(kardexPromedio))[i - 1].saldos.valor) /
                    parseFloat(Object.values(clone(kardexPromedio))[i - 1].saldos.cantidad);
                kardexPromedio[`operacion${i}`].salida = {};
                //Calculamos la cantidad de SALIDA
                kardexPromedio[`operacion${i}`].salida.cantidad = datos[operacion].cantidad;
                //Calculamos el valor de SALIDA = cantidad * valor unitario
                kardexPromedio[`operacion${i}`].salida.valor =
                    parseFloat(datos[operacion].cantidad) * parseFloat(kardexPromedio[`operacion${i}`].valorUnitario);
                kardexPromedio[`operacion${i}`].saldos = {};
                //Calculamos la cantidad de SALDOS
                kardexPromedio[`operacion${i}`].saldos.cantidad =
                    parseFloat(Object.values(kardexPromedio)[i - 1].saldos.cantidad) -
                    parseFloat(datos[operacion].cantidad);
                //Calculamos el valor de SALDOS
                kardexPromedio[`operacion${i}`].saldos.valor =
                    parseFloat(Object.values(clone(kardexPromedio))[i - 1].saldos.valor) -
                    parseFloat(kardexPromedio[`operacion${i}`].salida.valor);
            }
        }
        i++;
    }

    return;
};

function clone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    var temp = obj.constructor();
    for (var key in obj) {
        temp[key] = clone(obj[key]);
    }

    return temp;
}
module.exports = {
    procesarDatos,
};
