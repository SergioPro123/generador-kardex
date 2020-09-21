/*
//Esta seccion recibira la funcion los valores de los kardex y retornara los totales de cada kardex
  con la siguiente estructura:

{
    kardexPromedio,kardexPEPS,kardexUEPS:{
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
let procesarTotales = (kardexPromedio, kardexPEPS, kardexUEPS) => {
    let kardexTotales = {};

    //Obtenemos la longitudad de los kardex
    let i = 0;
    for (operacion in kardexPromedio) {
        i++;
    }
    i--;

    kardexTotales.kardexPromedio = {};
    kardexTotales.kardexPEPS = {};
    kardexTotales.kardexUEPS = {};

    kardexTotales.kardexPromedio.compras = {};
    kardexTotales.kardexPEPS.compras = {};
    kardexTotales.kardexUEPS.compras = {};

    kardexTotales.kardexPromedio.costoMateriales = {};
    kardexTotales.kardexPEPS.costoMateriales = {};
    kardexTotales.kardexUEPS.costoMateriales = {};

    kardexTotales.kardexPromedio.inventarioFinal = {};
    kardexTotales.kardexPEPS.inventarioFinal = {};
    kardexTotales.kardexUEPS.inventarioFinal = {};
    //Calculamos la suma de las COMPRAS, de los tres kardex

    kardexTotales.kardexPromedio.compras.cantidad = sumarCeldas(kardexPromedio, 'entrada', 'cantidad');
    kardexTotales.kardexPromedio.compras.valor = sumarCeldas(kardexPromedio, 'entrada', 'valor');

    kardexTotales.kardexPEPS.compras.cantidad = sumarCeldas(kardexPEPS, 'entrada', 'cantidad');
    kardexTotales.kardexPEPS.compras.valor = sumarCeldas(kardexPEPS, 'entrada', 'valor');

    kardexTotales.kardexUEPS.compras.cantidad = sumarCeldas(kardexUEPS, 'entrada', 'cantidad');
    kardexTotales.kardexUEPS.compras.valor = sumarCeldas(kardexUEPS, 'entrada', 'valor');

    //Calculamos la suma de COSTO DE MATERIALES, de lo tres kardex
    kardexTotales.kardexPromedio.costoMateriales.cantidad = sumarCeldas(kardexPromedio, 'salida', 'cantidad');
    kardexTotales.kardexPromedio.costoMateriales.valor = sumarCeldas(kardexPromedio, 'salida', 'valor');

    kardexTotales.kardexPEPS.costoMateriales.cantidad = sumarCeldas(kardexPEPS, 'salida', 'cantidad');
    kardexTotales.kardexPEPS.costoMateriales.valor = sumarCeldas(kardexPEPS, 'salida', 'valor');

    kardexTotales.kardexUEPS.costoMateriales.cantidad = sumarCeldas(kardexUEPS, 'salida', 'cantidad');
    kardexTotales.kardexUEPS.costoMateriales.valor = sumarCeldas(kardexUEPS, 'salida', 'valor');

    //Obtenemos el valor de INVENTARIO DE MATERIALES, que es el valor de la ultima operacion
    kardexTotales.kardexPromedio.inventarioFinal.cantidad = parseFloat(
        Object.values(kardexPromedio)[i].saldos.cantidad
    );
    kardexTotales.kardexPromedio.inventarioFinal.valor = parseFloat(Object.values(kardexPromedio)[i].saldos.valor);

    kardexTotales.kardexPEPS.inventarioFinal.cantidad = parseFloat(Object.values(kardexPEPS)[i].saldos.cantidad);
    kardexTotales.kardexPEPS.inventarioFinal.valor = parseFloat(Object.values(kardexPEPS)[i].saldos.valor);

    kardexTotales.kardexUEPS.inventarioFinal.cantidad = parseFloat(Object.values(kardexUEPS)[i].saldos.cantidad);
    kardexTotales.kardexUEPS.inventarioFinal.valor = parseFloat(Object.values(kardexUEPS)[i].saldos.valor);
    return kardexTotales;
};

let sumarCeldas = (datos, nombreGrupo, nombreCelda) => {
    let suma = 0;
    for (const operacion in datos) {
        if (datos.hasOwnProperty(operacion)) {
            if (datos[operacion].hasOwnProperty(nombreGrupo)) {
                if (datos[operacion][nombreGrupo].hasOwnProperty(nombreCelda)) {
                    suma += parseFloat(datos[operacion][nombreGrupo][nombreCelda]);
                }
            }
        }
    }

    return suma;
};

module.exports = {
    procesarTotales,
};
