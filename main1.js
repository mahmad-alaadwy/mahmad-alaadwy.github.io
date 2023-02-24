import * as THREE from './three.js';

document.addEventListener("DOMContentLoaded",()=>{

const initializer=async()=>{
    const container=document.querySelector("#ar-area");
    const arButton=document.querySelector("#ar-button");

    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera();
    const renderer=new THREE.WebGLRenderer({alpha:true});
    
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const geometry=new THREE.BoxGeometry(1 ,1 ,1);
    const material=new THREE.MeshBasicMaterial({color:"#0000ff"});
    const mesh =new THREE.Mesh(geometry,material);

    scene.add(mesh);
    mesh.position.set(0,-2,-3);

    const light =new THREE.HemisphereLight(0xffffffff,0xbbbbff,1);
    scene.add(light);

    const supported= navigator.xr && await navigator.xr.isSessionSupported("immersive-ar");
    if(!supported){
        arButton.textContent="not supported";
        arButton.disabled=true;
        return;
    }

    let currentSession=null;
    const start =async()=>{
        arButton.textContent="END";
        currentSession=await navigator.xr.requestSession("immersive-ar",
        {optionalFeatures:['dom-overlay'],domOverlay: { root:document.body}});
        renderer.xr.enabled=true;
        renderer.xr.setReferenceSpaceType('local');
        await renderer.xr.setSession(currentSession);
        renderer.setAnimationLoop(()=>{
            renderer.render(scene,camera);
        });
    }
   
    const end=async()=>{
        currentSession.end();
        renderer.clear();
        renderer.setAnimationLoop(null);
        arButton.style.display="none";
    }

    arButton.addEventListener("click",()=>{
        if(currentSession){
            end();
        }else{
            start();
        }
    });

}
initializer();

});



