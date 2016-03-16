function enableButtons() {
    $('#check').css({
        cursor: 'pointer',
        opacity: 1
    }).click(check);
    $('#hint').css({
        cursor: 'pointer',
        opacity: 1
    }).click(correctAnswer);
    $('#replay').css({
        cursor: 'pointer',
        opacity: 1
    }).click(restart);
    $('#close').off();
}

function disableButtons() {
    $('#check').css({
        cursor: 'default',
        opacity: .5
    }).off();
    $('#hint').css({
        cursor: 'default',
        opacity: .5
    }).off();
    $('#close').click(closeModal);
}

function disableAllButtons() {
    $('#check').css({
        cursor: 'default',
        opacity: .5
    }).off();
    $('#hint').css({
        cursor: 'default',
        opacity: .5
    }).off();
     $('#replay').css({
        cursor: 'default',
        opacity: .5
    }).off();
    $('#close').click(closeModal);
}

//show modal
showModal = function(message, modalClass) {
    disableButtons();
    var modalClass = modalClass;
    $("#modal").fadeIn().center().removeClass().addClass(modalClass);
    $('#modal-title').html(message);
    console.log('modal shown');
}

//close modal
closeModal = function() {
    enableButtons();
    $("#modal").fadeOut();
    console.log('modal hidden');
}