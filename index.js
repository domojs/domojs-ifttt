$.service('index.js', './lifttt', function(p){
    $.ifttt=p;
    
});

exports.init=function(config){
    $.device(null, {        name:'mode',
        category:'values',
        type:'virtualState',
states:config}, function(device){
        device.on('status', function(state){
            $.emit('ifttt', {"cmd":"mode", "params":state})
        })
    });
};