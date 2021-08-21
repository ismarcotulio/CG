
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

}

window.onload = main