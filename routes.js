route.on('ifttt', function(url, params, unchanged){
    $.ajax(loadHtml('ifttt')); 
});

route.on('ifttt/{name}', function(url, params, unchanged){
    $.ajax(loadHtml('ifttt/recipe/'+params.name)); 
});