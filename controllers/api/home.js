module.exports={
	get:function(id, callback)
	{
		if(typeof(id)=='undefined')
		{
		    $('fs').readFile('./lifttt/recipes.json', function(err, data){
		        if(err)
		            console.log(err);
	            callback(JSON.parse(data));
		    })    
		}
		else
		{
            this.get(undefined, function(recipes){
                var recipe=$.grep(recipes, function(item){ return item.name==id })[0];
                if(!recipe)
                    callback(404);
                return callback(recipe);
            });
		}
	},
	items:function(id, term, callback)
	{
        var result=[];
        $('fs').readdir('./lifttt/modules', function(err, files){
           $.eachAsync(files, function(index, item, next){
               var path='./lifttt/modules/'+item;
               var moduleFileName=item;
               $('fs').realpath(path, function(err, resolvedPath)
               {
                   if(err)
                   {
                       console.log(err);
                       next();
                       return;
                   }
                   var m=$(resolvedPath);
                   if(m[id])
                   {
                       $.each(m[id], function(index, item){
                           if(!term || item.name.indexOf(term)>=0 || moduleFileName.indexOf(term)>=0)
                           {
                               result.push({
                                   path:moduleFileName,
                                   name:item.name
                               });
                           }
                       })
                   }
                   next();
               });
           }, function (){
               callback(result);
           });
        });
	},
	trigger:function(id, callback)
	{
        var ids=id.split(',');
        $('fs').realpath('./lifttt/modules/'+ids[0], function(err, resolvedPath)
        {
            var found=false;
            if(err)
            {
                console.log(err);
                callback([]);
                return;
            }
            var m=$(resolvedPath);
            if(m.triggers)
            {
                $.each(m.triggers, function(index, item){
                    if(item.name==ids[1] && !found)
                    {
                        callback(item.fields);
                        found=true;
                    }
                });
            }
            if(!found)
                callback([]);
        });
	},
	action:function(id, callback)
	{
        var ids=id.split(',');
        $('fs').realpath('./lifttt/modules/'+ids[0], function(err, resolvedPath)
        {
            var found=false;
            if(err)
            {
                console.log(err);
                callback([]);
                return;
            }
            var m=$(resolvedPath);
            if(m.actions)
            {
                $.each(m.actions, function(index, item){
                    if(item.name==ids[1] && !found)
                    {
                        callback(item.fields);
                        found=true;
                    }
                });
            }
            if(!found)
                callback([]);
        });
	},
	recipe:function(id, body, callback)
	{
        this.get(undefined, function(recipes){
            var recipe;
            if(id!='_new')
            {
                recipe=$.grep(recipes, function(item){ return item.name==id })[0];
                if(!recipe)
                    callback(404);
                console.log(body);
            }
            else
            {
                recipes.push(recipe={});
            }
            $.extend(recipe, body);
            $('fs').writeFile('./lifttt/recipes.json', JSON.stringify(recipes, null, 4), function(err){
                if(err)
                {
                    console.log(err);
                    callback(500);
                }
                else
                    callback(200);
            });
        });
	},
	delete:function(id, callback){
        this.get(undefined, function(recipes){
            var recipe=$.grep(recipes, function(item){ return item.name==id })[0];
            if(!recipe)
                callback(404);
            recipes.splice(recipes.indexOf(recipe), 1);
            $('fs').writeFile('./lifttt/recipes.json', JSON.stringify(recipes), function(err){
                if(err)
                {
                    console.log(err);
                    callback(500);
                }
                else
                    callback(200);
            });
        });
	},
	control:function(id, value, callback){
	    console.log(id);
	    console.log(value);
        switch(id)
        {
            case 'restart':
            case 'mode':
                $.io.emit('ifttt', {cmd:id, params:value});
                callback(200);
                break;
            default:
                callback(404);
        }
	}
};

