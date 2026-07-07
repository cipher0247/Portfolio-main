/*==============================================================*/
// Web3Forms Contact Form JS
/*==============================================================*/
(function ($) {
    "use strict";

    $("#contactForm").on("submit", function (event) {
        event.preventDefault();

        var form = this;
        var formData = new FormData(form);
        formData.set('access_key', formData.get('access_key') || 'YOUR_WEB3FORMS_ACCESS_KEY');

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.success) {
                form.reset();
                $("#msgSubmit").removeClass().addClass('h4 text-left tada animated text-success').text('Message Submitted!');
            } else {
                $("#msgSubmit").removeClass().addClass('h4 text-left text-danger').text(data.message || 'Unable to send message.');
            }
        })
        .catch(function () {
            $("#msgSubmit").removeClass().addClass('h4 text-left text-danger').text('Unable to send message.');
        });
    });
}(jQuery));