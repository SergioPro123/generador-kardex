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
 */
let procesarDatos = (req, res) => {
    let datos = new Object();
    datos = req.body;
    //Esta variable tipo Objeto, contendremos los varoles del Kardex
    let kardex = new Object();
    //llenamos el inventario inicial, el cual no cambia
    kardex.inventarioInicial = datos.inventarioInicial;
    console.log(kardex);
    //Recorremos cada una de las operaciones
    for (const operacion in datos) {
        if (datos.hasOwnProperty(operacion)) {
            //De aqui se empieza a procesar cada operacion
        }
    }

    res.sendStatus(200);
};

module.exports = {
    procesarDatos,
};
