import * as THREE from './three.js';

document.addEventListener("DOMContentLoaded",()=>{

    const container=document.querySelector("#ar-area");
    
    const scene=new THREE.Scene();

    const geometry=new THREE.BoxGeometry(1 ,1 ,1);
    const material=new THREE.MeshBasicMaterial({color:"#0000ff"});
    const mesh =new THREE.Mesh(geometry,material);

    scene.add(mesh);

    mesh.position.set(0,0,-2);

    const camera=new THREE.PerspectiveCamera();

    camera.position.set(1,1,5);


    const renderer=new THREE.WebGLRenderer({alpha:true});
    renderer.setSize(window.innerWidth-50,window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.render(scene,camera);

    const video=document.createElement("video");
    navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
        video.srcObject=stream;
        video.play();
    });


    video.style.position="absolute"; 
    video.style.width=window.innerWidth-50+'px';
    video.style.height=window.innerHeight+'px';
    renderer.domElement.style.position="absolute";


    container.appendChild(video);

    container.appendChild(renderer.domElement);

});



