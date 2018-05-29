$("ul").on("click", "li", function(){
    $(this).toggleClass("done");
});

//click on "X" to delete item
$("ul").on("click", "span", function(event){
    $(this).parent().fadeOut(1000, function(){
        $(this).remove();
    })
    event.stopPropagation();
});

//create new item
$("input[type='text']").keypress(function(event){
    if(event.which === 13){
        //grab new todo item from input
        var todoText = $(this).val();
        $(this).val("");
        //create a new li and add to ul
        $("ul").append("<li><span><i class='fas fa-trash-alt'></i></span> "+todoText+"</li>");
    }
})
$(".fa-plus").click(function(){
    $("input[type='text']").fadeToggle()
})