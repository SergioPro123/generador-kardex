//Verficaremos que los datos que nos envian, sean correctos
let validarDatos = (req, res, next) => {
    let datos = new Object();
    datos = req.body;
    if (!datos.hasOwnProperty('inventarioInicial')) {
        //Falta el inventario Inicial
        respuesta(res, 400, 'false', 'Falta el Inventario Inicial.');
        return;
    }
    //Recorremos cada una de las operaciones
    for (const operacion in datos) {
        if (datos.hasOwnProperty(operacion)) {
            //Validamos el campo 'cantidad'.
            if (!validarVariableNumerica(res, datos, operacion, 'cantidad', 1)) {
                return;
            }
            //Validamos el campo 'valorUnitario'.
            if (!validarVariableNumerica(res, datos, operacion, 'valorUnitario', 0)) {
                return;
            }
            //Si se trata del Inventario Inicial, no es necesario validar el campo 'Tipo de Operacion'.
            if (operacion == 'inventarioInicial') {
                continue;
            }
            //Validamos el campo 'tipoOperacion'
            if (datos[operacion].hasOwnProperty('tipoOperacion')) {
                if (
                    !(datos[operacion]['tipoOperacion'] === 'compra' || datos[operacion]['tipoOperacion'] === 'venta')
                ) {
                    //la variable no cumple con el valor 'compra' ó 'venta'.
                    respuesta(res, 400, 'false', "la variable no cumple con el valor 'compra' ó 'venta'.");
                    return;
                }
            } else {
                //Falta valores en el campo 'tipoOperacion'.
                respuesta(res, 400, 'false', "Falta valores en el campo 'tipo de operacion'.");
                return;
            }
        }
    }

    //Si llega acá, es por que la validacion fue exitosa.
    next();
};

let validarVariableNumerica = (res, datos, operacion, nombreVariable, min) => {
    //Por si esta vacia, es valido
    if (datos[operacion][nombreVariable] == '') {
        return true;
    }
    if (datos[operacion].hasOwnProperty(nombreVariable)) {
        //Validamos que sea un numero entero

        if (isNumber(datos[operacion][nombreVariable])) {
            //Comprobamos que sea mayor que cero.
            if (!(parseFloat(datos[operacion][nombreVariable]) >= min)) {
                //El campo no es un numero entero.
                respuesta(res, 400, 'false', `Inconsistencia numerica en el campo. '${nombreVariable}'.`);
                return false;
            }
        } else {
            //El campo no es un numero entero.
            respuesta(res, 400, 'false', `Inconsistencia numerica en el campo '${nombreVariable}'.`);
            return false;
        }
    } else {
        //Falta valores en el campo.
        respuesta(res, 400, 'false', `Falta valores en el campo '${nombreVariable}'.`);
        return false;
    }
    return true;
};

let respuesta = (res, codigo, ok, message) => {
    res.status(codigo).json({
        ok: 'false',
        err: {
            message,
        },
    });
};

let isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};
module.exports = {
    validarDatos,
};
