(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $('.fixed-top').css('top', $('.top-bar').height());
    $(window).scroll(function () {
        if ($(this).scrollTop()) {
            $('.fixed-top').addClass('bg-dark').css('top', 0);
        } else {
            $('.fixed-top').removeClass('bg-dark').css('top', $('.top-bar').height());
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1500,
        loop: true,
        nav: true,
        dots: false,
        items: 1,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });

    
})(jQuery);

$(document).ready(function() {
    $.ajax({
        url: '/upload',
        type: "GET",
        success: function(response) {
            // Generar el HTML para el carrusel
            var carouselHTML = '';

            // Iterar sobre los datos recibidos
            if (response["datos"] && response["datos"].length > 0) {
                response["datos"].forEach(function(item) {
                    // Generar cada item del carrusel con el formato proporcionado
                    carouselHTML += `
                        <div class="owl-carousel-item position-relative">
                            <img class="img-fluid" src="${item['image_name']}" alt="">
                            <div class="owl-carousel-inner">
                                <div class="container">
                                    <div class="row justify-content-start">
                                        <div class="col-lg-8">
                                            <h1 class="display-1 text-light mb-4 animated slideInDown">We Bake With Passion</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                carouselHTML = '<div class="text-center text-light">No hay imágenes disponibles</div>';
            }

            // Insertar el HTML generado en el contenedor del carrusel
            document.querySelector('#carouselContainer').innerHTML = carouselHTML;
        },
        error: function() {
            // Manejo del error en caso de que la solicitud falle
            document.querySelector('#carouselContainer').innerHTML = '<div class="text-center text-light">Error al cargar las imágenes</div>';
        }
    });
});
