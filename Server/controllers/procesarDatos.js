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

const procesarKardexPromedio = require('./procesarKardexPromedio');
const procesarKardexPEPS_UEPS = require('./procesarKardexPEPS_UEPS');

let { clone } = require('./funciones');

let procesarDatos = (req, res) => {
    let datos = new Object();
    datos = req.body;
    //llenamos el inventario inicial, el cual no cambia
    kardexPromedio.inventarioInicial = clone(datos.inventarioInicial);
    kardexPEPS.inventarioInicial = clone(datos.inventarioInicial);
    kardexUEPS.inventarioInicial = clone(datos.inventarioInicial);

    //Procesamos el kardex PROMEDIO PONDERADO
    kardexPromedio = procesarKardexPromedio.calculaKardexPromedio(datos);
    //Procesamos el kardex PEPS
    kardexPEPS = procesarKardexPEPS_UEPS.calculaKardexPEPS_UEPS(datos, 0);
    //Procesamos el kardex UEPS
    kardexUEPS = procesarKardexPEPS_UEPS.calculaKardexPEPS_UEPS(datos, 1);

    res.sendStatus(200);
};

module.exports = {
    procesarDatos,
};
