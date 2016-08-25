$(document).ready(
    function(){

        function refreshList() {
            $('#todo_list').empty();
            $.get("/todos", function(data, status){

                if (status == 'success') {
                    for (var i = 0; i < data.length; i++) {
                        $('#todo_list').append(
                            $('<li>').attr('data-id', data[i]._id).append(data[i].name + ' (' + data[i].note + ')'));

                        //$('#todo_list').append('<li data-id=\'' + data[i]._id +'\'>' + data[i].name + ' (' + data[i].note + ')' + '</li>');
                    }
                }
            });
        }

        refreshList();

        $('#button').click(
            function(){
                var name = $('input[name=ListItem]').val();
                var note = $('input[name=ListNote]').val();
                //$('ol').append('<li>' + name + ' (' + note + ')' + '</li>');
                var objToSave = {
                    name: name,
                    note: note,
                    completed: true
                };

                $.ajax({
                    url:"/todos",
                    type:"POST",
                    data: JSON.stringify(objToSave),
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    success: function(){

                    }
                });
                refreshList();
            });

        $("input[name=ListItem]").keyup(function(event){
            if(event.keyCode == 13){
                $("#button").click();
            }
        });

        $('#todo_list').on('dblclick','li', function(){
            $(this).toggleClass('strike').fadeOut('slow');
            var recordId = $(this).attr("data-id");
            $.ajax({
                url: '/todos/' + recordId,
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                }
            });
            $(this).remove();
            //refreshList();
        });

        $('#todo_list').on('click','li', function(){
            var recordId = $(this).attr("data-id");
            window.location = '/jobs/' + recordId;
        });

        $('input').focus(function() {
            $(this).val('');
        });

        $('#todo_list').sortable();

    }
);