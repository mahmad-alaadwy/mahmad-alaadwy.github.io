import * as THREE from './three.js';

document.addEventListener("DOMContentLoaded",()=>{

const initializer=async()=>{
    const container=document.querySelector("#ar-area");
    const arButton=document.querySelector("#ar-button");

    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera();

    
    const light =new THREE.HemisphereLight(0xffffffff,0xbbbbff,1);
    scene.add(light);

    
    const raticalG=new THREE.RingGeometry(.15,.2,22).rotateX(Math.PI/2);
    const raticalM=new THREE.MeshBasicMaterial();
    const ratical=new THREE.Mesh(raticalG,raticalM);
    ratical.matrixAutoUpdate=false;
    ratical.visible=false;
    scene.add(ratical);

    const renderer=new THREE.WebGLRenderer({alpha:true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled=true;
    container.appendChild(renderer.domElement);

    // const geometry=new THREE.BoxGeometry(1 ,1 ,1);
    // const material=new THREE.MeshBasicMaterial({color:"#0000ff"});
    // const mesh =new THREE.Mesh(geometry,material);

    // scene.add(mesh);
    // mesh.position.set(0,-2,-3);



    const supported= navigator.xr && await navigator.xr.isSessionSupported("immersive-ar");
    if(!supported){
        arButton.textContent="not supported";
        arButton.disabled=true;
        return;
    }

    const controller= renderer.xr.getController(0);
    scene.add(controller);


    controller.addEventListener("select",()=>{
        const geometry=new THREE.BoxGeometry(.06,.06,.06);
        const material=new THREE.MeshBasicMaterial({color:0xffffff*Math.random()});
        const mesh=new THREE.Mesh(geometry,material);
        mesh.position.setFromMatrixPosition(ratical.matrix);
        mesh.scale.y=Math.random()*2+1;
        scene.add(mesh);
    });
  
    renderer.xr.addEventListener("sessionstart",async ()=>{
        const session =renderer.xr.getSession();
        const viewerRefernceSpace =await session.requestReferenceSpace("viewer");
        const hitTestSource = await session.requestHitTestSource({space: viewerRefernceSpace});
        renderer.setAnimationLoop((timestamp,frame)=>{
            if(!frame) return;
            const hitTestResults=frame.getHitTestResults(hitTestSource);

            if(hitTestResults.lenght){
                const hit=hitTestResults[0];
                const referenceSpace=renderer.xr.getReferenceSpace();
                const hitPosition = hit.getPose(referenceSpace);

                ratical.visible=true;
                ratical.matrix.fromArray(hitPosition.transform.matrix);
            }
            else{
                ratical.visible=false;
                
            }

            renderer.render(scene,camera);
        });
        console.log("session start from session started event ");

    });

    let currentSession=null;
    const start =async()=>{
        arButton.textContent="END";
        currentSession=await navigator.xr.requestSession("immersive-ar",
        {requiredFeatures:['hit-test'],optionalFeatures:['dom-overlay'],domOverlay: { root:document.body}});
        renderer.xr.enabled=true;
        renderer.xr.setReferenceSpaceType('local');
        await renderer.xr.setSession(currentSession);
        console.log("session setted from start function");
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



