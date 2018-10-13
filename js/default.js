$(document).ready(function () {

    $('a').click(function (e) { if ($(this).attr('disabled')) { e.preventDefault(); return false; } });

});
