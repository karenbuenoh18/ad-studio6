/* AD Studio - comportamiento minimo, sin librerias ni llamadas externas. */
(function () {
  'use strict';

  /* --- barra: transparente sobre el hero, solida al bajar --- */
  var bar = document.querySelector('.bar');
  var hero = document.querySelector('.hero, .phero');
  if (bar) {
    if (!hero) {
      bar.classList.add('is-plain', 'is-solid');
    } else {
      var onScroll = function () {
        bar.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.55);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* --- menu hamburguesa --- */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      bar.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        bar.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- tarjetas del equipo: voltean al hacer clic o con teclado --- */
  Array.prototype.forEach.call(document.querySelectorAll('.flip'), function (card) {
    card.addEventListener('click', function () {
      var on = card.getAttribute('aria-pressed') === 'true';
      card.setAttribute('aria-pressed', on ? 'false' : 'true');
    });
  });

  /* --- galerias: en movil se muestran 4 de 8 hasta pedir el resto --- */
  Array.prototype.forEach.call(document.querySelectorAll('.more'), function (btn) {
    btn.addEventListener('click', function () {
      var grid = document.getElementById(btn.getAttribute('data-for'));
      if (!grid) return;
      grid.classList.add('is-all');
      btn.remove();
    });
  });

  /* --- formulario de contacto -------------------------------------
     No hay servidor: el formulario arma el mensaje y lo entrega por
     la via que elija la persona, correo o WhatsApp. Los datos nunca
     pasan por un tercero; salen del propio telefono o computadora.
     ----------------------------------------------------------------- */
  var form = document.querySelector('form[data-wa]');
  if (form) {
    var estado = form.querySelector('.estado');
    var via = 'wa';

    Array.prototype.forEach.call(form.querySelectorAll('button[value]'), function (b) {
      b.addEventListener('click', function () { via = b.value; });
    });

    var texto = function (d) {
      var l = [];
      l.push('Hola AD Studio, soy ' + (d.get('nombre') || '(sin nombre)') + '.');
      if (d.get('tipo')) l.push('Me interesa: ' + d.get('tipo') + '.');
      if (d.get('fecha')) l.push('Fecha: ' + d.get('fecha') + '.');
      if (d.get('telefono')) l.push('Teléfono: ' + d.get('telefono') + '.');
      if (d.get('email')) l.push('Correo: ' + d.get('email') + '.');
      if (d.get('mensaje')) l.push('', d.get('mensaje'));
      return l.join('\n');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = (form.elements.nombre.value || '').trim();
      if (!nombre) {
        if (estado) estado.textContent = 'Escribe tu nombre para poder continuar.';
        form.elements.nombre.focus();
        return;
      }
      var cuerpo = texto(new FormData(form));

      if (via === 'mail') {
        var asunto = 'Cotización AD Studio' + (form.elements.tipo.value ? ' · ' + form.elements.tipo.value : '');
        if (estado) estado.textContent = 'Abriendo tu programa de correo…';
        window.location.href = 'mailto:' + form.getAttribute('data-mail') +
          '?subject=' + encodeURIComponent(asunto) +
          '&body=' + encodeURIComponent(cuerpo);
      } else {
        if (estado) estado.textContent = 'Abriendo WhatsApp…';
        window.open('https://wa.me/' + form.getAttribute('data-wa') +
          '?text=' + encodeURIComponent(cuerpo), '_blank', 'noopener');
      }
    });
  }

  /* --- año del pie --- */
  var anio = document.querySelector('.anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
