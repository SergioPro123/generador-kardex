var operaciones = 0;
var datosOperaciones = {};
var date = new Date();
let fechaActual = date.getFullYear() + '-';
if (date.getMonth() + 1 < 10) {
    fechaActual += '0' + (date.getMonth() + 1) + '-';
} else {
    fechaActual += date.getMonth() + 1 + '-';
}
if (date.getDate() < 10) {
    fechaActual += '0' + date.getDate();
} else {
    fechaActual += date.getDate();
}
datosOperaciones.inventarioInicial = {
    fecha: fechaActual,
    cantidad: '1',
    valorUnitario: '1',
    descripcion: '',
};
//Esta variable contrendra el ID de un registro cuando se selecciona editar.
var idUltimaEditacion;
//Esta variable contendra el ID de un registro cuando se selecciona eliminar
var idUltimaEliminacion;

$(document).ready(function () {
    // Select/Deselect checkboxes
    $('#selectAll').on('click', function () {
        let checkbox = $('table tbody input[type="checkbox"]');
        if (this.checked) {
            checkbox.each(function () {
                this.checked = true;
            });
        } else {
            checkbox.each(function () {
                this.checked = false;
            });
        }
    });
    $('table tbody input[type="checkbox"]').on('click', function () {
        if (!this.checked) {
            $('#selectAll').prop('checked', false);
        }
    });

    //Este evento se encarga de agregar nuevos registros a la tabla
    $('form#formAgregar').on('submit', function (event) {
        event.preventDefault();
        let info = $(this).serializeArray();
        let datos = {};
        $.each(info, function (i, array) {
            datos[array.name] = array.value;
        });
        //comprobamos que no haya ningun valor unitario si selecciono la opcion "venta"
        if (datos.tipoOperacion === 'venta') {
            datos.valorUnitario = '0';
        }
        //agregamos los datos recien añadidos a los datos totales
        datosOperaciones[`operacion${++operaciones}`] = datos;
        // contruimos el registro
        let registro =
            "<tr id='operacion" +
            operaciones +
            "'>" +
            "<td> <span class='custom-checkbox'>" +
            "<input type='checkbox' id='checkboxOperacion" +
            operaciones +
            "' name='options[]' value='" +
            operaciones +
            "'>" +
            "<label for='checkbox" +
            operaciones +
            "'></label>" +
            '</span>' +
            '</td>' +
            `<td>${datos.fecha}</td>` +
            `<td>${datos.tipoOperacion.charAt(0).toUpperCase() + datos.tipoOperacion.substring(1)}</td>` +
            `<td>${datos.descripcion}</td>` +
            `<td>${datos.cantidad}</td>` +
            `<td>${datos.valorUnitario || ''}</td>` +
            '<td>' +
            "<a href='#editEmployeeModal' class='edit' data-toggle='modal'><i class='material-icons' data-toggle='tooltip' title='Editar'>&#xE254;</i></a>" +
            "<a href='#deleteEmployeeModal' class='delete' data-toggle='modal'><i class='material-icons' data-toggle='tooltip' title='Eliminar'>&#xE872;</i></a>" +
            '</td>' +
            '</tr>';

        //Añadimos un nuevo registro a la tabla
        $('tbody#tabla').append(registro);
        //Cerramos el modal de 'Agregar Operación'
        $('#addEmployeeModal').modal('hide');
        //Limpiamos el formulario
        $(this)[0].reset();
        //Si la opcion de valor unitario por alguna razon se oculto, vuelve y se muestra
        $('div#valorUnitarioAgregar').show();
        //Actualizamos la visualizacion de operaciones actuales
        $('#cantidadOperaciones').text(parseInt($('#cantidadOperaciones').text()) + 1);
        // Activate tooltip
        $('[data-toggle="tooltip"]').tooltip();
    });

    //Este evento captura los cambios de la entrada 'Select',
    //ya que si el motivo es de compra, se reflejara la opcion
    //de valor unitario, de lo contrario se ocultara.
    $('#selectAgregar').on('change', function () {
        let divValorUnitario = $('div#valorUnitarioAgregar');
        let input = $('div#valorUnitarioAgregar input');
        if ($(this).val() === 'compra') {
            divValorUnitario.fadeIn(300);
            input.prop('required', true);
        } else {
            divValorUnitario.fadeOut(300);
            input.prop('required', false);
        }
    });
    //La misma funcion, pero va enfocada al modal Editar
    $('form#formEditar #tipoOperacionEdit').on('change', function () {
        let divValorUnitario = $('div#valorUnitarioEditDiv');
        let input = $('div#valorUnitarioEdit');
        if ($(this).val() === 'compra') {
            divValorUnitario.fadeIn(300);
            input.prop('required', true);
        } else {
            divValorUnitario.fadeOut(300);
            input.prop('required', false);
        }
    });
});
//Esta funcion es para abrir el modal de editar, con la informació seleccionada
$(document).on('click', 'tr td a[href = "#editEmployeeModal"]', function (event) {
    idUltimaEditacion = $(this).parent().parent().attr('id');
    let select = datosOperaciones[idUltimaEditacion].tipoOperacion;

    $('form#formEditar #fechaEdit').val(datosOperaciones[idUltimaEditacion].fecha);
    if (select === 'venta') {
        q;
        $("form#formEditar #tipoOperacionEdit option[value='venta']").attr('selected', true);
        //Ocultamos el Valor Unitario
        $('form#formEditar #valorUnitarioEditDiv').hide();
        $('form#formEditar #valorUnitarioEdit').prop('required', false);
    } else {
        $("form#formEditar #tipoOperacionEdit option[value='comprar']").attr('selected', true);
        //Se muestra el valor Unitario
        $('form#formEditar #valorUnitarioEditDiv').show();
        $('form#formEditar #valorUnitarioEdit').prop('required', true);
        $('form#formEditar #valorUnitarioEdit').val(datosOperaciones[idUltimaEditacion].valorUnitario);
    }
    $('form#formEditar #descripcionEdit').val(datosOperaciones[idUltimaEditacion].descripcion);
    $('form#formEditar #cantidadEdit').val(datosOperaciones[idUltimaEditacion].cantidad);
});

//Esta funcion es para abrir el modal de editar de unico registro llamado 'INVENTARIO INICIAL'
$(document).on('click', 'tr td a[href = "#editEmployeeModalInventario"]', function (event) {
    idUltimaEditacion = $(this).parent().parent().attr('id');

    $('form#formEditarInventario #valorUnitarioEditDivInventario').show();
    $('form#formEditarInventario #valorUnitarioEditInventario').prop('required', true);
    $('form#formEditarInventario #valorUnitarioEditInventario').val(datosOperaciones[idUltimaEditacion].valorUnitario);

    $('form#formEditarInventario #fechaEditInventario').val(datosOperaciones[idUltimaEditacion].fecha);
    $('form#formEditarInventario #descripcionEditInventario').val(datosOperaciones[idUltimaEditacion].descripcion);
    $('form#formEditarInventario #cantidadEditInventario').val(datosOperaciones[idUltimaEditacion].cantidad);
});

//Este evento se encarga de editar nuestros registros
$(document).on('submit', 'form#formEditar', function (event) {
    event.preventDefault();
    let info = $(this).serializeArray();
    let datos = {};
    $.each(info, function (i, array) {
        datos[array.name] = array.value;
    });
    //comprobamos que no haya ningun valor unitario si selecciono la opcion "venta"
    if (datos.tipoOperacion === 'venta') {
        datos.valorUnitario = '0';
    }
    //Actualizamos de la operacion en nuestro array, que contiene todas las operaciones.
    datosOperaciones[idUltimaEditacion] = datos;

    // Recontruimos el registro
    let registro =
        "<td> <span class='custom-checkbox'>" +
        "<input type='checkbox' id='checkboxOperacion" +
        idUltimaEditacion +
        "' name='options[]' value='" +
        idUltimaEditacion +
        "'>" +
        "<label for='checkbox" +
        idUltimaEditacion +
        "'></label>" +
        '</span>' +
        '</td>' +
        `<td>${datos.fecha}</td>` +
        `<td>${datos.tipoOperacion.charAt(0).toUpperCase() + datos.tipoOperacion.substring(1)}</td>` +
        `<td>${datos.descripcion}</td>` +
        `<td>${datos.cantidad}</td>` +
        `<td>${datos.valorUnitario || ''}</td>` +
        '<td>' +
        "<a href='#editEmployeeModal' class='edit' data-toggle='modal'><i class='material-icons' data-toggle='tooltip' title='Editar'>&#xE254;</i></a>" +
        "<a href='#deleteEmployeeModal' class='delete' data-toggle='modal'><i class='material-icons' data-toggle='tooltip' title='Eliminar'>&#xE872;</i></a>" +
        '</td>';
    //Añadimos un nuevo registro a la tabla
    $(`tbody#tabla tr#${idUltimaEditacion}`).html(registro);
    //Cerramos el modal de 'Editar Operación'
    $('#editEmployeeModal').modal('hide');
    //Limpiamos el formulario
    $(this)[0].reset();
    // Activate tooltip
    $('[data-toggle="tooltip"]').tooltip();
});

//Este evento se encarga de editar el Inventario Inicial
$(document).on('submit', 'form#formEditarInventario', function (event) {
    event.preventDefault();
    let info = $(this).serializeArray();
    let datos = {};
    $.each(info, function (i, array) {
        datos[array.name] = array.value;
    });
    //Actualizamos de la operacion en nuestro array, que contiene todas las operaciones.
    datosOperaciones[idUltimaEditacion] = datos;

    // Recontruimos el registro
    let registro =
        '<td> </td>' +
        `<td>${datos.fecha}</td>` +
        `<td>Inventario Inicial</td>` +
        `<td>${datos.descripcion}</td>` +
        `<td>${datos.cantidad}</td>` +
        `<td>${datos.valorUnitario || '1'}</td>` +
        '<td>' +
        "<a href='#editEmployeeModalInventario' class='edit' data-toggle='modal'><i class='material-icons' data-toggle='tooltip' title='Editar'>&#xE254;</i></a>" +
        '</td>';
    //Añadimos un nuevo registro a la tabla
    $(`tbody#tabla tr#${idUltimaEditacion}`).html(registro);
    //Cerramos el modal de 'Editar Operación'
    $('#editEmployeeModalInventario').modal('hide');
    //Limpiamos el formulario
    $(this)[0].reset();
    // Activate tooltip
    $('[data-toggle="tooltip"]').tooltip();
});

//Esta funcion es para capturar el ID del registro que se quiere eliminar
$(document).on('click', 'tr td a[href = "#deleteEmployeeModal"]', function (event) {
    idUltimaEliminacion = $(this).parent().parent().attr('id');
});

//Este evento se encarga de eliminar un registro seleccionado.
$(document).on('submit', 'form#formEliminar', function (event) {
    event.preventDefault();
    delete datosOperaciones[idUltimaEliminacion];
    //Cerramos el modal de 'Eliminar Operación'
    $('#deleteEmployeeModal').modal('hide');
    //Ocultamos primero la tabla para dar un efecto de desvanecimiento
    $(`tbody#tabla tr#${idUltimaEliminacion}`).fadeOut(500, function () {
        //Eliminamos la operacion de la tabla
        $(`tbody#tabla tr#${idUltimaEliminacion}`).remove();
    });
    //Actualizamos la visualizacion de operaciones actuales
    $('#cantidadOperaciones').text(parseInt($('#cantidadOperaciones').text()) - 1);
});

//Este evento se encarga de eliminar un grupo seleccionado de registro.
$(document).on('submit', 'form#formEliminarGrupo', function (event) {
    event.preventDefault();
    let checkbox = $('table tbody input[type="checkbox"]');
    let i = 0;
    //Cerramos el modal de 'Eliminar Operación'
    $('#deleteEmployeeModalGrupo').modal('hide');
    checkbox.each(function () {
        if ($(this).prop('checked')) {
            i++;
            let id = $(this).parent().parent().parent().attr('id');
            delete datosOperaciones[id];
            $(`tbody#tabla tr#${id}`).fadeOut(500, function () {
                //Eliminamos la operacion de la tabla
                $(`tbody#tabla tr#${id}`).remove();
            });
        }
    });
    //Actualizamos la visualizacion de operaciones actuales
    $('#cantidadOperaciones').text(parseInt($('#cantidadOperaciones').text()) - i);
});

//Esta funcion es la encargada de enviar los datos a la API del servidor, el cual regresa el archivo excel.
$(document).on('click', ' a[href = "#generarKardex"]#generarKardex', function (event) {
    event.preventDefault();

    download(datosOperaciones);
});

function download(data) {
    var url = '/generarKardex';

    fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => {
            res.blob();
            console.log(res);
        })
        .catch((error) => console.error('Error:', error))
        .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'Kardex.xlsx';
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
        });
}
