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

{
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
    kardexPromedio.inventarioInicial = datos.inventarioInicial;
    kardexPEPS.inventarioInicial = datos.inventarioInicial;
    kardexUEPS.inventarioInicial = datos.inventarioInicial;

    //Procesamos el kardex PROMEDIO PONDERADO
    calculaKardexPromedio(datos);
    //console.log(Object.values(datos)[1]);

    console.log(kardexPromedio);
    res.sendStatus(200);
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
                    parseFloat(Object.values(kardexPromedio)[i - 1].saldos.cantidad) +
                    parseFloat(datos[operacion].cantidad);
                //Calculamos el valor de SALDOS
                kardexPromedio[`operacion${i}`].saldos.valor =
                    parseFloat(Object.values(kardexPromedio)[i - 1].saldos.valor) +
                    parseFloat(kardexPromedio[`operacion${i}`].entrada.valor);
            } else {
                //Calculamos el valor unitario = SALDOS Anterior: valor / cantidad
                kardexPromedio[`operacion${i}`].valorUnitario =
                    parseFloat(Object.values(kardexPromedio)[i - 1].saldos.valor) /
                    parseFloat(Object.values(kardexPromedio)[i - 1].saldos.cantidad);
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
                    parseFloat(Object.values(kardexPromedio)[i - 1].saldos.valor) -
                    parseFloat(kardexPromedio[`operacion${i}`].salida.valor);
            }
        }
        i++;
    }

    return kardexPromedio;
};

module.exports = {
    procesarDatos,
};
