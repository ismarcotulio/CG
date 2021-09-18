class WebGL{

    constructor(id){
        this.gl = this.init(id);
    }

    init(id){
        return document.getElementById(id).getContext('webgl') || document.getElementById(id).getContext('experimental-webgl');
    }

    verifyInit(){
        if(!this.gl) console.error('No se ah inicializado webgl correctamente');
    }
    
}

export {WebGL}