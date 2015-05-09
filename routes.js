route.on('ifttt', function(url, params, unchanged){
    $.ajax(loadHtml('ifttt')).done(function(){
        page.addCommand({name:'restart', cmd:'/api/ifttt/control/restart'});
        page.addCommand({name:'Mode Normal', cmd:'/api/ifttt/control/mode?value=normal'});
        page.addCommand({name:'Mode TP', cmd:'/api/ifttt/control/mode?value=TP'});
    }); 
});

route.on('ifttt/{name}', function(url, params, unchanged){
    $.ajax(loadHtml('ifttt/recipe/'+params.name)); 
});