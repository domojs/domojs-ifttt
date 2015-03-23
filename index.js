var cp=false;

function start(){
    if(!cp)
    {
        cp=$('child_process').fork('index.js', [], {cwd:'./lifttt'});
        cp.on('exit', function(){
            console.log('lifttt exited');
            cp=false;
            start();
        });
    }
}

start();

