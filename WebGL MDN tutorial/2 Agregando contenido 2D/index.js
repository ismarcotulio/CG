
function main(){
    //OBTENIENDO EL SELECTOR DEL CANVAS
    const canvas = document.querySelector("#glCanvas")

    //INICIALIZANDO EN CONTEXTO DE LENGUAJE GRAFICO WEBGL
    const gl = canvas.getContext("webgl");

    //COMRPOBANDO QUE WEBGL TRABAJA CORRECTAMENTE
    if(gl === null){
        alert( "No se pudo inicializar WEBGL, comprueba que tu navegador o pc lo soporten" )
        return;
    }

    //ASIGNAMOS UN LIMPIADO DE PANTALLA EN NEGRO SIN OPACIDAD
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //LIMPIAMOS EN COLOR EN EL BUFFER CON EL COLOR ESPECIFICADO, EN ESTE CASO NEGRO
    gl.clear(gl.COLOR_BUFFER_BIT);

    //DECLARANDO EL VERTEX SHADER
    const vsSource = `
        attribute vec4 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main(){
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `;

    //DECLARANDO EL FRAGMENT SHADER
    const fsSource = `
        void main(){
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `

    //CREANDO LA INSTANCIA DEL PROGRAMA SHADER
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    //INDICANDO LAS DIRECCIONES QUE WEBGL DEBERA ASIGNAR A NUESTRAS ENTRADAS
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttriblocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    }

}
//ESTA FUNCION INICIALIZA NUESTROS SHADERS PARA QUE WEBGL SEPA COMO DIBUJAR NUESTROS DATOS
function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FREGMENT_SHADER, fsSource);

    //CREANDO EL PROGRAMA SHADER
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    //VERIFICANDO QUE EL PROGRAMA SHADER SE HALLA CREADO CORRECTAMENTE
    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        alert(`No se ah podido inicializar el programa shader ${gl.getShaderInfoLog(shaderProgram)}`);
        return null
    }

    return shaderProgram;
}

//ESTA FUNCIOM CREA UN SHADER DADO UN TIPO, CARGA EL ARCHIVO FUENTE Y LO COMPILA
function loadShader( gl, type, source ){
    const shader = gl.createShader(type);

    //ENVIANDO EL ARCHIVO FUENTE HACIA EL OBJETO SHADER
    gl.shaderSource(shader, source);

    //COMPILANDO EL PROGRAMA SHADER
    gl.compileShader(shader);

    //VERIFICANDO QUE EL PROGRAMA SE HAYA COMPILADO EXITOSAMENTE
    if (!getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert(`Ah ocurrido un error al tratar de compilar el shader ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

window.onload = main