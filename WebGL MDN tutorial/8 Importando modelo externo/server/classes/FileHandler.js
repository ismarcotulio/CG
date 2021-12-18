class FileHandler{ 

    loadText(url, callback){
        var request = new XMLHttpRequest();
	    request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
	    request.onload = async function () {
            if (request.status < 200 || request.status > 299) {
                callback(null);
            } else {
                callback(request.responseText);
            }
	    };
	    request.send();
    }

    loadImage (url, callback) {
        var image = new Image();
        image.onload = () => {
            callback(image);
        };
        image.src = url;
    }
    
    loadJSON (url, callback) {
        this.loadText(url, (jsonResponse) => {
            if(jsonResponse){
                callback(JSON.parse(jsonResponse));
            }else{
                callback(null, message);
            }
        })
    }

    getAllFiles(callback) {
        this.loadText('/glsl/shader.vs.glsl', (vsResponse) => {
            if(vsResponse) this.loadText("/glsl/shader.fs.glsl", (fsResponse) => {
                if(fsResponse) this.loadJSON('/resources/toiletPaper.json', (jsonResponse) => {
                    if(jsonResponse) this.loadImage('/textures/toiletPaperTexture1.jpg', (texture1Response) => {
                        if(texture1Response) this.loadImage('/textures/toiletPaperTexture2.jpg', (texture2Response) => {
                            if(texture2Response) this.loadImage('/textures/toiletPaperTexture3.jpg', (texture3Response) => {
                                callback(
                                    vsResponse,
                                    fsResponse, 
                                    jsonResponse, 
                                    [texture1Response, texture2Response, texture3Response]
                                );
                            })
                        })
                    })
                })
            })
        })      
    }

}

export { FileHandler }