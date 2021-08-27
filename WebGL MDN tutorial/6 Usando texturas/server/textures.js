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
        attribute vec2 aTextureCoord;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec2 vTextureCoord;

        void main(){
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;
        }
    `;

    //DECLARANDO EL FRAGMENT SHADER
    const fsSource = `
        varying highp vec2 vTextureCoord;

        uniform sampler2D uSampler;

        void main(){
            gl_FragColor = texture2D(uSampler, vTextureCoord);
        }
    `;

    //CREANDO LA INSTANCIA DEL PROGRAMA SHADER
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    //INDICANDO LAS DIRECCIONES QUE WEBGL DEBERA ASIGNAR A NUESTRAS ENTRADAS
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };

    const buffers = initBuffers(gl);

    const texture = loadTexture(gl, 'hn.jpg')

    var then = 0;

    //DIBUJAMOS LA ESCENA REPETIDAMENTE
    function render(now){
        now *= 0.001; //CONVERSION A SEGUNDOS
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, texture, deltaTime);

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

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  
  const textureCoordinates = [
      // DELANTERA
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // CARA TRASERA
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // CARA ARRIBA
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // CARA ABAJO
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // CARA DERECHA
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // CARA IZQUIERDA
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ]

  gl.bufferData(
      gl.ARRAY_BUFFER, 
      new Float32Array(textureCoordinates),
      gl.STATIC_DRAW
  );

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
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}


//ESTA FUNCION SE ENCARGA DE RENDERIZAR LA ESCENA
function drawScene(gl, programInfo, buffers, texture, deltaTime){
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

    //LE INDICAMOS A WEBGL COMO OBTENER LAS COORDENADAS DEL BUFFER DE TEXTURA
    {
        const num = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            num,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

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

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    

    {
        const offset = 0;
        const type = gl.UNSIGNED_SHORT;
        const vertexCount = 36;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    cubeRotation += deltaTime;
}

//INICIALIZAMOS UNA TEXTURA Y CARGAMOS UNA IMAGEN
//CUANDO LA IMAGEN TERMINE DE CARGARSE LA COPIAMOS EN LA TEXTURA
function loadTexture(gl, url){
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel
    );

    const image = new Image();
    image.crossOrigin = "Anonymous"
    image.onload = function(){
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image
        );

        //CHEQUEAMOS SI LA IAMGEN ES DE POTENCIA 2
        if(isPowerOf2(image.width) && isPowerOf2(image.height)){
            gl.generateMipmap(gl.TEXTURE_2D);
        }else{
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value){
    return (value & (value - 1)) == 0;
}

window.onload = main