//Verficaremos que los datos que nos envian, sean correctos
let validarDatos = (req, res, next) => {
    console.log('middleware ok');
    next();
};

module.exports = {
    validarDatos,
};
