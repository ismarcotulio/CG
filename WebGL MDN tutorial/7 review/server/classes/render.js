import {WebGL}  from './webGL.js';
import { FileLoader } from './fileLoader.js';

var webgl;

window.onload = () => {
    webgl = new WebGL('glCanvas');
    webgl.verifyInit()

}
    


