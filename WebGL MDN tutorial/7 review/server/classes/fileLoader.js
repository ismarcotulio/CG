class FileLoader{

    constructor(){}

    loadText(url, callback){
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onreadystatechange = () => {
            if(request.readyState == 4){
                if(request.status == 200){
                    callback(null, request.responseText);
                }else{
                    callback(`Error: codigo ${request.status} en la url ${url}`)
                }
            }
        }
        request.send(null); 
    }

    loadShaders(vsUrl, fsUrl, callback){
        this.loadText(vsUrl, (vsErr, vsRes) => {
            if(!vsErr){
                this.loadText(fsUrl, (fsErr, fsRes) => {
                    if(!fsErr){
                        this.vs = vsRes;
                        this.fs = fsRes;
                        callback(vsRes, fsRes);     
                    }
                })
            }
        })
    }

}

export {FileLoader}