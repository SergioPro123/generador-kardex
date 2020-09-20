/*
Esta funcion se encargara de procesar los datos enviados por el cliente,
se recibira un objeto con la siguiente estructura:
{
    operacion#:{
        cantidad,
        descripcion,
        fecha,
        tipoOperacion,
        valorUnitario
    }
}
 */
let procesarDatos = (req, res) => {
    let datos = new Object();
    datos = req.body;
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
