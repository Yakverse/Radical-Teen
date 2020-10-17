(function ($) {

  $('body').append('<div id="toast"></div>')

  $.fn.toast = function (options) {

    var settings = $.extend({
      type: 'normal',
      message: null,
      href: '#',
      reload: false
    }, options);

    var item = $('<div class="notification ' + settings.type + '"><span>' + settings.message + '</span></div>');
    this.append($(item));
    $(item).animate({ "right": "12px" }, "fast");
    setInterval(function () {
      $(item).animate({ "right": "-400px" }, function () {
        if (settings.reload) {
          window.location.reload(true)
          $(item).remove();
          return
        }
        window.location.href = settings.href
        $(item).remove();
      });
    }, 4000);
  }

  $(document).on('click', '.notification', function () {
    $(this).fadeOut(400, function () {
      $(this).remove();
    });
  });

}(jQuery));

  // MENSAGENS

  // $("#toast").toast({
  //   message: 'Mensagem Extra'
  // });

  // $("#toast").toast({
  //   type: 'success',
  //   message: 'Mensagem de Sucesso'
  // });

  // $("#toast").toast({
  //   type: 'error',
  //   message: 'Mensagem de Erro'
  // });