/**
 * Created by CtheSky on 2016/10/27.
 */
// sidebar animation
$('#side_bar_trigger').click(function toggleClass(){
    // Toggle navbar class
    $('#side_bar').toggleClass('open');

    // Toggle arrow direction of trigger button
    var $trigger_content = $('#trigger_content');
    if ($trigger_content.hasClass('glyphicon-chevron-right')) {
        $trigger_content.removeClass('glyphicon-chevron-right');
        $trigger_content.addClass('glyphicon-chevron-left');
    } else {
        $trigger_content.addClass('glyphicon-chevron-right');
        $trigger_content.removeClass('glyphicon-chevron-left');
    }
});