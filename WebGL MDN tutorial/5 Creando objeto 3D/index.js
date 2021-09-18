var cubeRotation = 0.0;

function main(){
    //OBTENIENDO EL SELECTOR DEL CANVAS
    const canvas = document.querySelector("#glCanvas")

    //INICIALIZANDO EN CONTEXTO DE LENGUAJE GRAFICO WEBGL
    const gl = canvas.getContext("webgl") || canvas.getContext('experimental-webgl');

    //COMRPOBANDO QUE WEBGL TRABAJA CORRECTAMENTE
    if(!gl){
        alert( "No se pudo inicializar WEBGL, comprueba que tu navegador o pc lo soporten" )
        return;
    }

    //ASIGNAMOS UN LIMPIADO DE PANTALLA EN NEGRO SIN OPACIDAD
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //LIMPIAMOS EN COLOR EN EL BUFFER CON EL COLOR ESPECIFICADO, EN ESTE CASO NEGRO
    //gl.clear(gl.COLOR_BUFFER_BIT);

    //DECLARANDO EL VERTEX SHADER ACTUALIZADO PARA OBTENER LOS COLORES DEL BUS DE DATOS DE COLORES
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main(){
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aVertexColor;
        }
    `;

    //DECLARANDO EL FRAGMENT SHADER
    const fsSource = `
        varying lowp vec4 vColor;

        void main(){
            gl_FragColor = vColor;
        }
    `;

    //CREANDO LA INSTANCIA DEL PROGRAMA SHADER
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    //INDICANDO LAS DIRECCIONES QUE WEBGL DEBERA ASIGNAR A NUESTRAS ENTRADAS
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    const buffers = initBuffers(gl);

    var then = 0;

    //DIBUJAMOS LA ESCENA REPETIDAMENTE
    function render(now){
        now *= 0.001; //CONVERSION A SEGUNDOS
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, deltaTime);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}


//ESTA FUNCION INICIALIZA NUESTROS SHADERS PARA QUE WEBGL SEPA COMO DIBUJAR NUESTROS DATOS
function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

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
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert(`Ah ocurrido un error al tratar de compilar el shader ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}


//ESTA FUNCION SE ENCARGA DE CREAR BUFFERS QUE CONTENGAN LA POSICION DE LOS VERTICES
function initBuffers(gl){

    //CREANDO BUFFER PARA LAS POSICIONES EN UN PLANO CUADRADO
    const positionBuffer = gl.createBuffer();

    //INDICAMOS QUE QUEREMOS UTILIZAR EL positionBuffer PARA REALIZAR OPERACIONES DE BUS DE DATOS
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //LUEGO CREAMOS UN ARRAY DE POSICIONES PARA EL CUADRADO
    const positions = [
        //CARA FRONTAL
       -1.0,    -1.0,    1.0,
        1.0,    -1.0,    1.0,
        1.0,     1.0,    1.0,
       -1.0,     1.0,    1.0,
       
       //CARA TRASERA
       -1.0,    -1.0,   -1.0,
       -1.0,     1.0,   -1.0,
        1.0,     1.0,   -1.0,
        1.0,    -1.0,   -1.0,

        //CARA de ARRIBA
       -1.0,     1.0,   -1.0,
       -1.0,     1.0,    1.0,
        1.0,     1.0,    1.0,
        1.0,     1.0,   -1.0,
        
        //CARA DE ABAJO
       -1.0,    -1.0,   -1.0,
        1.0,    -1.0,   -1.0,
        1.0,    -1.0,    1.0,
       -1.0,    -1.0,    1.0,
       
       //CARA DERECHA
       1.0,     -1.0,   -1.0,
       1.0,      1.0,   -1.0,
       1.0,      1.0,    1.0,
       1.0,     -1.0,    1.0,

       //CARA IZQUIERDA
      -1.0,     -1.0,   -1.0,
      -1.0,     -1.0,    1.0,
      -1.0,      1.0,    1.0,
      -1.0,      1.0,   -1.0,   
    ];

    //DESPUES PASAMOS LA LISTA DE POSICIONES HACIA WEBGL PARA CONSTRUIR LA FORMA.
    gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);

    //ESTABLECEMOS LOS COLORES PARA LOS CUATRO VERTICES
    const faceColors = [
        [1.0,  1.0,  1.0,  1.0],    // CARA DELANTERA BLANCA
        [1.0,  0.0,  0.0,  1.0],    // CARA TRASERA ROJA
        [0.0,  1.0,  0.0,  1.0],    // CARA ARRIBA VERDE
        [0.0,  0.0,  1.0,  1.0],    // CARA ABAJO AZUL
        [1.0,  1.0,  0.0,  1.0],    // CARA DERECHA AMARILLA
        [1.0,  0.0,  1.0,  1.0],    // CARA IZQUIERDA MORADA
    ];

    var colors = [];

    for(var j = 0; j < faceColors.length; ++j){
        const c = faceColors[j];

        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


  const indices = [
    0,  1,  2,      0,  2,  3,    
    4,  5,  6,      4,  6,  7,    
    8,  9,  10,     8,  10, 11,   
    12, 13, 14,     12, 14, 15,  
    16, 17, 18,     16, 18, 19,   
    20, 21, 22,     20, 22, 23,   
  ];


  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}


//ESTA FUNCION SE ENCARGA DE RENDERIZAR LA ESCENA
function drawScene(gl, programInfo, buffers, deltaTime){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    //LIMPIAMOS EL IENZO ANTES DE COMENZAR A DIBUJAR EN EL
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //CREAMOS UNA MATRIX DE PERSPECTIVA, UNA MATRIX ESPECIAL QUE ES UTILIZADA PARA SIMULAR
    // LA DISTORSION DE PERSPECTIVA EN UNA CAMARA.
    const fieldOfView = 45 * Math.PI / 180; //EN RADIANES
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create(); 

    mat4.perspective(
        projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar
    );

    const modelViewMatrix = mat4.create();

    mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.0, -6.0]
    );

    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation,
        [0, 0, 1]
    );

    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        cubeRotation * .7,
        [0, 1, 0]
    );

    //LE INDICAMOS A WEBGL COMO OBTENER LAS POSICIONES DEL BUS DE DATOS DE POSICIONES 
    //HACIA EL ATRIBUTO DE VERTICES DE POSICIONES
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition
        );
    }

    //LE INDICAMOS A WEBGL COMO OBTENER LOS COLORES DEL BUS DE DATOS DE COLORES HACIA
    //EL ATRIBUTO DE VERTICE DE COLORES
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor
        );
    }

    //LE INDICAMOS A WEBGL QUE UTILICE NUESTRO PROGRAMA CUANDO DIBUJE
    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );

    {
        const offset = 0;
        const type = gl.UNSIGNED_SHORT;
        const vertexCount = 36;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    cubeRotation += deltaTime;
}

window.onload = main