var operaciones = 0;
var datosOperaciones = {};

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
        //agregamos los datos recien añadidos a los datos totales
        datosOperaciones[`operacion${++operaciones}`] = datos;
        //comprobamos que no haya ningun valor unitario si selecciono la opcion "venta"
        if (datos.tipoOperacion === 'venta') {
            datos.valorUnitario = '';
        }
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
        //Asociamos eventos a las etiquetas "a"
    });

    //Este evento captura los cambios de la entrada 'Select',
    //ya que si el motivo es de compra, se reflejara la opcion
    //de valor unitario, de lo contrario se ocultara.
    $('#selectAgregar').on('change', function () {
        let select = $('div#valorUnitarioAgregar');
        let input = $('div#valorUnitarioAgregar input');
        console.log();
        if ($(this).val() === 'compra') {
            select.fadeIn(300);
            input.prop('required', true);
        } else {
            select.fadeOut(300);
            input.prop('required', false);
        }
    });
});
//Esta funcion es para abrir el modal de editar, con la informació seleccionada
$(document).on('click', 'tr td a[href = "#editEmployeeModal"]', function (event) {
    let idOperacion = $(this).parent().parent().attr('id');
    let select = datosOperaciones[idOperacion].tipoOperacion;
    console.log(select);
    if (select === 'venta') {
        $("form#formEditar #tipoOperacionEdit option[value='venta']").attr('selected', true);
    } else {
        $("form#formEditar #tipoOperacionEdit option[value='comprar']").attr('selected', true);
    }
    $('form#formEditar #descripcionEdit').val(datosOperaciones[idOperacion].descripcion);
    $('form#formEditar #cantidadEdit').val(datosOperaciones[idOperacion].cantidad);
    $('form#formEditar #valorUnitarioEdit').val(datosOperaciones[idOperacion].valorUnitario);
});
