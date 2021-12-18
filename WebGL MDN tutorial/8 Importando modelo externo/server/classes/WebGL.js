class WebGL{

    checkWebGL(canvas, opts){
        var contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], gl;
        for(let context of contexts){
            try{
                gl = canvas.getContext(context, opts);
            } catch(e){}
            if(gl){
                break;
            }
        }

        if(!gl){
            alert("WebGL not available.")
        }
        return gl;
    }

    createProgram(gl, vertexShader, fragmentShader) {
        /**
         * Create and return a shader program
         **/
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
  
        // Check that shader program was able to link to WebGL
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          var error = gl.getProgramInfoLog(program);
          console.log('Failed to link program: ' + error);
          gl.deleteProgram(program);
          gl.deleteShader(fragmentShader);
          gl.deleteShader(vertexShader);
          return null;
        }
  
        // Set the vertex and fragment shader to the program for easy access
        program.vertexShader = vertexShader;
        program.fragmentShader = fragmentShader;
  
        // Render buffers for all the attributes
        program.renderBuffers = function(obj) {
          var indexBuffer = gl.createBuffer();
          var attributes = program.vertexShader.attributes;
          for (var i=0; i<attributes.length; i++) {
            var name = attributes[i].name;
            var objAttribute = obj.attributes[name];
            console.log(objAttribute)
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, objAttribute.bufferData, gl.STATIC_DRAW);
            var attr = gl.getAttribLocation(program, name);
            gl.enableVertexAttribArray(attr);
            gl.vertexAttribPointer(
              attr,
              objAttribute.size,
              gl.FLOAT,
              false,
              objAttribute.bufferData.BYTES_PER_ELEMENT*obj.stride,
              objAttribute.bufferData.BYTES_PER_ELEMENT*objAttribute.offset
            );
          }
  
          if (obj.indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, obj.indices, gl.STATIC_DRAW);
          }
        }
  
        return program;
      }

      getShader(gl, type, source) {
        /**
         * Get, compile, and return an embedded shader object
         **/
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
  
        // Check if compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.log("An error occurred compiling the shaders:" + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
  
        // Set the attributes, varying, and uniform to shader
        shader.attributes = this.attributesFromSource(source);
        shader.varyings = this.varyingsFromSource(source);
        shader.uniforms = this.uniformsFromSource(source);
        return shader;
      }
  
      /*
       * Get attributes, varyings, and uniforms from source dynamically.
       */
      xFromSource(source, x) {
        var xs = [];
        var lines = source.split('\n');
        for (var i=0; i<lines.length; i++) {
          var line = lines[i];
          // check that it contains the keyword at the beginning of the line (not a comment)
          if (line.slice(0, x.length) == x) {
            var words = line.split(' ');
            // remove the semicolon
            var name = words[2].slice(0, words[2].length-1);
            xs.push({type:words[1], name:name});
          }
        }
        return xs;
      }

      attributesFromSource(source) {
        return this.xFromSource(source, 'attribute');
      }

      varyingsFromSource(source) {
        return this.xFromSource(source, 'varying');
      }

      uniformsFromSource(source) {
        return this.xFromSource(source, 'uniform');
      }

};


export { WebGL }