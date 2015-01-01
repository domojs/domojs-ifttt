var api=require('./api/home.js');

module.exports={
    index:function(id){
        return api.get(id, this.view);
    },
    recipe:function(id){
        var self=this;
        if(id=='_new')
        {
            self.view({name:'_new', trigger:{params:{}}, action:{params:{}}});
        }
        else
            return api.get(id, function(recipe){
                console.log('recipe: '+recipe);
                if(recipe!=404 && recipe)
                    self.view(recipe);
                else
                    self.response.redirect('/ifttt');
            });
    },
    delete:function(id){
        api.delete(id, function(){
            self.response.redirect('/ifttt');
        })
    }
};