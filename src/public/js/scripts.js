/*!
* Start Bootstrap - Freelancer v7.0.6 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 72,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});





$(document).ready(function() {
  $('.nav-link').click(function(event) {
    event.preventDefault();

    var href = $(this).attr('href');
    
    // Obtén solo el nombre del archivo eliminando la parte de la ruta "views/"
    var nombreArchivo = href.replace('views/', '');

    $.ajax({
      url: nombreArchivo,
      type: 'GET',
      success: function(response) {
        // Aquí puedes manipular la respuesta y mostrar el contenido del archivo en tu página
        window.location.href = nombreArchivo;
      },
      error: function(error) {
        console.log('Error en la petición:', error);
      }
    });
  });
});












//Actualizar noticia 
const updateButtons = document.getElementsByClassName('updateButton');
for (let i = 0; i < updateButtons.length; i++) {
    updateButtons[i].addEventListener('click', function () {

        
        var newHeading = this.parentNode.parentNode.querySelector('#editableInput').value;
        var newDescription = this.parentNode.parentNode.querySelector('#floatingTextarea2').value;
        if (newDescription.trim() === '') {
            newDescription = this.parentNode.parentNode.querySelector('#descripcion2').innerText;
        }

           if (newHeading.trim() === '') {
            newHeading = this.parentNode.parentNode.querySelector('#titulo2').innerText;
        }
        var id = this.dataset.id;
        console.log(id); // Aquí puedes usar el valor del _id como desees

        var requestData = {
            title: newHeading,
            description: newDescription // Usar una cadena vacía si no se proporciona ninguna descripción
        };
        $.ajax({
            url: '/edit/' + id,
            type: 'POST',
            data: requestData,
            success: function (response) {
                // Redireccionar a la página deseada en caso de éxito
                window.location.href = "/adm";
            },
            error: function () {
                alert('Error al actualizar el título');
            }
        });
    });
}
