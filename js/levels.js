$(document).ready(function () {

    $('.btn-start').click(function (e) {

        e.preventDefault();

        $('.boas-vindas').slideUp(300);
        $('.game-container').fadeIn(300);

        return false;

    });

});
