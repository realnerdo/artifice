$(function(){
    var $body = $('body');
    var base_url = window.location.origin;

    // dropdown
    var dropdown = $('.dropdown');
    if(dropdown.length){
        $(window).click(function() {
            dropdown.find('.list').removeClass('open');
        });
        $body.on('click', '.dropdown', function(e){
            if ($(e.target).hasClass('link'))
                return true;
            var list = $(this).find('.list');
            list.addClass('open');
            return false;
        });
    }

    // Select2
    var selectable = $('.select2');

    if(selectable.length){
        selectable.select2({
            width: '100%',
            language: 'es'
        });
    }
    var selectable_product = $('.select2-product');
    if(selectable_product.length){

        function formatProductSelection(product){
            return product.title || product.text
        }

        function formatProduct(product) {
            if (!product.id) { return product.text; }
            var with_sale = (product.sale_price != '' && product.sale_price) ? 'with-sale' : '',
                regular_price = '<h5 class="product-regular-price '+with_sale+'">$'+product.regular_price+'</h5>',
                sale_price = (product.sale_price != '' && product.sale_price) ? '<h5 class="product-sale-price">$'+product.sale_price+'</h5>' : '',
                brand = (product.brand != '') ? '<h5 class="product-brand"><b>Marca:</b> <i>'+product.brand+'</i></h5>' : '',
                category = (product.category != '') ? '<h5 class="product-category"><b>Categoría:</b> <i>'+product.category+'</i></h5>' : '';
            var $product = $(
                '<span class="product-result">'+
                '<div class="product-photo"><img src="'+product.picture+'" class="img" /></div>'+
                '<div class="product-meta">'+
                '<h4 class="product-title">'+product.title+'</h4>'+
                '<h5 class="product-code"><b>Código:</b> <i>'+product.code+'</i></h5>'+
                brand+category+
                '</div>'+
                '<div class="product-description">'+product.description+'</div>'+
                '<div class="product-stock"><b>Disponibles</b> <p>'+product.stock+'</p></div>'+
                '<div class="product-price">'+regular_price+sale_price+'</div>'+
                '</span>'
            );
            return $product;
        }

        selectable_product.select2({
            width: '100%',
            language: 'es',
            data: function(params){
                return {
                    q: params.term, // search term
                    page: params.page
                }
            },
            ajax: {
                url: base_url+'/productos/getProducts',
                dataType: 'json',
                delay: 250,
                processResults: function(data, params){
                    params.page = params.page || 1;
                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    }
                }
            },
            cache: true,
            minimumInputLength: 1,
            escapeMarkup: function (markup) { return markup; },
            templateResult: formatProduct,
            templateSelection: formatProductSelection
        });
    }

    var selectable_add = $('.select2-add');
    if(selectable_add.length){
        selectable_add.select2({
            width: '100%',
            language: 'es',
            tags: true,
            selectOnClose: true
        });
    }

    // Datepicker
    var dateable = $('.datepicker');
    if(dateable.length){
        dateable.datepicker({
            language: 'es-ES',
            format: 'yyyy-mm-dd',
            startDate: new Date(),
            autoHide: true
        });
    }

    // Autosize
    var autosizable = $('.autosizable');
    if(autosizable.length){
        autosize(autosizable);
    }

    // Cotizador
    var cotizador_table = $('.cotizador');
    if(cotizador_table.length){
        var client_id = $('#client_id'),
            company = $('#company'),
            phone = $('#phone'),
            email = $('#email'),
            search_product = $('#search_product');

        client_id.on('change', function(){
            var id = $(this).val();
            $.get(base_url+'/clientes/getClientById/'+id, function(data){
                company.val(data.name);
                phone.val(data.phone);
                email.val(data.email);
            });
        });

        function numberWithCommas(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }

        function set_total(tr){
            if(tr){
                var qty = parseFloat((tr.find('.qty').val() != '') ? tr.find('.qty').val() : 0),
                    price_tag = tr.find('.product-price-total'),
                    price = parseFloat(price_tag.data('price')),
                    total_input = tr.find('.total'),
                    subtotal = price*qty,
                    discount_input = tr.find('.discount'),
                    discount_value = (discount_input.length && discount_input.val() != '') ? discount_input.val() : 0,
                    discount = (parseFloat(discount_value) / 100) * parseFloat(subtotal),
                    total = subtotal - discount;

                price_tag.text('$'+numberWithCommas(total.toFixed(2)));
                total_input.val(total.toFixed(2));
            }

            var products = $('.cotizador').find('tbody').find('tr');
                grand_subtotal = 0,
                grand_total = 0,
                grand_save = 0,
                gran_discount = 0;

            $.each(products, function(i, e){
                var $e = $(e),
                    qty = parseFloat(($e.find('.qty').val() != '') ? $e.find('.qty').val() : 0),
                    price = parseFloat($e.find('.product-price-total').data('price')),
                    subtotal = price*qty,
                    discount_input = $e.find('.discount'),
                    discount_value = (discount_input.length && discount_input.val() != '') ? discount_input.val() : 0,
                    discount = (parseFloat(discount_value) / 100) * parseFloat(subtotal),
                    total = subtotal - discount;

                grand_subtotal = grand_subtotal + subtotal;
                grand_total = grand_total + total;

            });

            grand_save = grand_subtotal - grand_total;
            grand_discount = grand_subtotal - grand_save;

            var span_grand_subtotal = $('#grand_subtotal'),
                span_grand_total = $('#grand_total'),
                tax = parseFloat($('#tax').data('tax')),
                taxes = (tax / 100) * grand_total,
                grand_total_after_tax =  grand_total + taxes;

            span_grand_subtotal.text('$'+numberWithCommas(grand_discount.toFixed(2)));
            span_grand_total.text('$'+numberWithCommas(grand_total_after_tax.toFixed(2)));

            var input_grand_subtotal = $('[name="subtotal"]'),
                input_grand_discount = $('[name="discount"]'),
                input_grand_save = $('[name="save"]'),
                input_grand_total = $('[name="total"]');

            input_grand_subtotal.val(grand_discount.toFixed(2));
            input_grand_discount.val(grand_discount.toFixed(2));
            input_grand_save.val(grand_save.toFixed(2));
            input_grand_total.val(grand_total_after_tax.toFixed(2));
        }

        search_product.on('change', function(){
            var $this = $(this),
                id = $this.val(),
                tr = $('<tr>');
            var products = $('.cotizador').find('[name="estimate_details['+id+'][product_id]"]');

            function add_product(id) {
                $.get(base_url+'/productos/getProductById/'+id, function(data){
                    var td_code = $('<td>', {
                        text: data.code,
                        'data-th': 'Código'
                    });

                    var div_photo = $('<div>', {
                        class: 'product-photo',
                        html: $('<img>', {
                            src: data.picture,
                            alt: data.title,
                            class: 'img'
                        })
                    });
                    var td_photo = $('<td>', {
                        html: div_photo,
                        'data-th': 'Foto'
                    });

                    var h4_title = $('<h4>', {
                        class: 'product-title',
                        text: data.title
                    });
                    var div_description = $('<div>', {
                        class: 'product-description',
                        html: data.description
                    });
                    var td_product = $('<td>', {'data-th': 'Descripción'});
                    if(data.brand){
                        var h5_brand = $('<h5>', {
                            class: 'product-brand',
                            html: '<b>Marca:</b> <i>'+data.brand.title+'</i>'
                        });
                        td_product.append(h5_brand);
                    }
                    if(data.category){
                        var h5_category = $('<h5>', {
                            class: 'product-category',
                            html: '<b>Marca:</b> <i>'+data.category.title+'</i>'
                        });
                        td_product.append(h5_category);
                    }
                    if(data.dimensions){
                        var checkbox_dimensions = $('<input>', {
                            type: 'checkbox',
                            name: 'estimate_details['+data.id+'][show_dimensions]',
                            value: 1
                        });
                        var label_dimensions = $('<label>', {text: 'Mostrar dimensiones'})
                        var h5_dimensions = $('<h5>', {
                            class: 'product-dimensions',
                            html: '<b>Dimensiones:</b> <i>'+data.dimensions+'</i>'
                        });
                        td_product.append(h5_category);
                    }
                    td_product.append(h4_title);
                    td_product.append(checkbox_dimensions);
                    td_product.append(label_dimensions);
                    td_product.append(h5_dimensions);
                    td_product.append(div_description);

                    var with_sale = (data.sale_price != '' && data.sale_price) ? 'with-sale' : '';
                    var regular_price = '<h5 class="price '+with_sale+'">$'+numberWithCommas(data.regular_price)+'</h5>';
                    var sale_price = (data.sale_price != '' && data.sale_price) ? '<h5 class="price">$'+numberWithCommas(data.sale_price)+'</h5>' : '';
                    var price = (data.sale_price != '' && data.sale_price) ? data.sale_price : data.regular_price;
                    var td_price = $('<td>', {
                        html: regular_price+sale_price,
                        'data-th': 'Precio Unit.'
                    });

                    var td_quantity = $('<td>', {
                        html: $('<input>', {
                            class: 'input qty',
                            value: 1,
                            type: 'number',
                            min: 1,
                            max: (data.stock > 0) ? data.stock : 1,
                            name: 'estimate_details['+data.id+'][qty]'
                        }),
                        'data-th': 'Cantidad'
                    });

                    var input_discount = $('<input>', {
                            class: 'input discount',
                            value: 0,
                            type: 'number',
                            min: 0,
                            max: 100,
                            name: 'estimate_details['+data.id+'][discount]'
                        });
                    var button_discount = $('<button>', {
                            class: 'unlock-discount btn btn-blue modal-trigger',
                            'data-modal': 'unlock-discount',
                            'data-id': data.id,
                            html: $('<i>', { class: 'typcn typcn-lock-closed' })
                        });
                    var td_discount = $('<td>', {
                        html: button_discount,
                        'data-th': 'Descuento'
                    });

                    var input_total = $('<input>', {
                        type: 'hidden',
                        name: 'estimate_details['+data.id+'][total]',
                        value: data.total,
                        class: 'total'
                    });
                    var span_total = $('<span>', {
                        class: 'product-price-total price',
                        'data-price': price,
                        text: '$'+price
                    });
                    var td_total = $('<td>', {'data-th': 'Total'});
                    td_total.append(span_total);
                    td_total.append(input_total);

                    var button_delete = $('<button>', {
                        class: 'delete-row',
                        html: '<i class="typcn typcn-delete"></i> Eliminar',
                    });
                    var product_hidden = $('<input>', {
                        name: 'estimate_details['+data.id+'][product_id]',
                        value: data.id,
                        type: 'hidden'
                    });
                    var td_options = $('<td>', {'data-th': 'Opciones'});
                    td_options.append(product_hidden);
                    td_options.append(button_delete);

                    tr.append(td_code);
                    tr.append(td_photo);
                    tr.append(td_product);
                    tr.append(td_price);
                    tr.append(td_quantity);
                    tr.append(td_discount);
                    tr.append(td_total);
                    tr.append(td_options);

                    cotizador_table.find('tbody').append(tr);
                    set_total(tr);
                });
            }

            if(products.length){
                products.each(function(){
                    var $this = $(this),
                        existent_id = $this.val();
                    if(existent_id == id){
                        var tr = $this.closest('tr'),
                            qty = tr.find('.qty'),
                            current_qty = parseInt(qty.val());
                        qty.val(current_qty + 1);
                        set_total(tr);
                    }else{
                        add_product(id);
                    }
                });
            }else{
                add_product(id);
            }
            $this.val(0);
        });

        $body.on('click', '.delete-row',function(){
            var $this = $(this),
                tr = $this.closest('tr');
            tr.remove();
            set_total(null);
            return false;
        });

        $body.on('keyup', '.qty, .discount', function(){
            var tr = $(this).closest('tr');
            set_total(tr);
        });
    }

    // Modal
    var modal = $('.modal');
    if(modal.length){

        function show_modal(modal_id, resource_id, client_email) {
            var modal = $('#'+modal_id+'-modal').addClass('show'),
                form = modal.find('.form'),
                action = form.attr('action')
                action_id = action.replace('{id}', resource_id);
            if(form.length)
                form.attr('action', action_id);
            if(client_email){
                $('#send-mail-modal').find('input[name="email"]').val(client_email);
            }
        }

        function close_modal(id){
            var modal = $('.layer');
            modal.removeClass('show');

            var form = modal.find('.form');
            if(form.length){
                var action = form.attr('action'),
                    action_wildcard = action.replace(/\d+/g, '{id}');
                form.attr('action', action_wildcard);
                form[0].reset();
            }

            if(id){
                var cotizador = $('.cotizador');
                if(cotizador.length){
                    var tr = cotizador.find('tr')
                            .find('input[name="estimate_details['+id+'][product_id]"]')
                            .closest('tr');
                    if(tr.length){
                        var td = tr.find('.unlock-discount').closest('td'),
                            hidden_discount = tr.find('.discount'),
                            current_discount = 0;
                        if(hidden_discount.length){
                            current_discount = hidden_discount.val();
                        }
                        if(td.length){
                            var input_discount = $('<input>', {
                                    class: 'input discount',
                                    value: current_discount,
                                    type: 'number',
                                    min: 0,
                                    max: 100,
                                    name: 'estimate_details['+id+'][discount]'
                                });
                            td.html(input_discount);
                        }
                    }
                }
            }
        }


        $body.on('click', '.modal-trigger', function(){
            var $this = $(this),
                modal_id = $this.data('modal'),
                resource_id = $this.data('id'),
                client_email = ($this[0].hasAttribute('data-email')) ? $this.data('email') : null;
            show_modal(modal_id, resource_id, client_email);
            return false;
        });

        $body.on('click', '.close-modal', function(){
            close_modal();
            return false;
        });

        $body.on('click', '.layer', function(e){
            if (e.target == this){
                close_modal();
            }
        });

        $(document).keyup(function(e) {
          if (e.keyCode === 27) close_modal();
        });

        var unlock_discount_modal = $('#unlock-discount-modal');
        if(unlock_discount_modal.length){
            var form = unlock_discount_modal.find('.form');
            form.submit(function(){
                var $this = $(this),
                    action = $this.attr('action'),
                    data = $this.serialize();
                $.post(action, data, function(data){
                    if(data.discount){
                        close_modal(data.product_id);
                    }
                });
                return false;
            });
        } // End Unlock discount

    }// End Modal

    // Notifications
    var notification = $('.notification');
    if(notification.length){
        notification.delay(4000).slideUp();
        $body.on('click', '.close-notification', function(){
            notification.slideUp();
        });
    }

    // Reportes
    var charts = $('.chart');
    if(charts.length){
        // var estimates_canvas = $('#estimates-chart');
        //
        // var estimates_chart_js = new Chart(estimates_canvas, {
        //     type: 'bar',
        //     data: {
        //         labels: ["Admin", "Juan", "Pepe"],
        //         datasets: [{
        //             label: 'Pendientes',
        //             data: [10, 19, 3],
        //             backgroundColor: [
        //                 'rgba(255, 99, 132, 0.2)',
        //                 'rgba(54, 162, 235, 0.2)',
        //                 'rgba(255, 206, 86, 0.2)'
        //             ],
        //             borderColor: [
        //                 'rgba(255,99,132,1)',
        //                 'rgba(54, 162, 235, 1)',
        //                 'rgba(255, 206, 86, 1)'
        //             ],
        //             borderWidth: 2
        //         },
        //         {
        //             label: 'Aceptadas',
        //             data: [2, 4, 7],
        //             backgroundColor: [
        //                 'rgba(255, 99, 132, 0.2)',
        //                 'rgba(54, 162, 235, 0.2)',
        //                 'rgba(255, 206, 86, 0.2)'
        //             ],
        //             borderColor: [
        //                 'rgba(255,99,132,1)',
        //                 'rgba(54, 162, 235, 1)',
        //                 'rgba(255, 206, 86, 1)'
        //             ],
        //             borderWidth: 2
        //         },
        //         {
        //             label: 'Rechazadas',
        //             data: [5, 9, 4],
        //             backgroundColor: [
        //                 'rgba(255, 99, 132, 0.2)',
        //                 'rgba(54, 162, 235, 0.2)',
        //                 'rgba(255, 206, 86, 0.2)'
        //             ],
        //             borderColor: [
        //                 'rgba(255,99,132,1)',
        //                 'rgba(54, 162, 235, 1)',
        //                 'rgba(255, 206, 86, 1)'
        //             ],
        //             borderWidth: 2
        //         }]
        //     },
        //     options: {
        //         scales: {
        //             yAxes: [{
        //                 ticks: {
        //                     beginAtZero:true
        //                 }
        //             }]
        //         }
        //     }
        // });

    } // End Reportes
});
