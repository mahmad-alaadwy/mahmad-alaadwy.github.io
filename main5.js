import * as THREE from './three.js';
import {ARButton} from './ARButton.js';

import { loadmodel } from './ModelLoader.js';


document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    const container=document.querySelector("#ar-area");
    const putmodel=document.querySelector("#ar-button");
    const turnXButtonpos =document.querySelector("#turn-around-x-pos");
    const turnXButtonneg =document.querySelector("#turn-around-x-neg");
    

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const reticleGeometry = new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX(- Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial(); 
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    const arButton = ARButton.createButton(renderer, {requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    container.appendChild(renderer.domElement);
    container.appendChild(arButton);

    const controller = renderer.xr.getController(0);
    scene.add(controller);


    const {model} = await loadmodel('./SheenChair.gltf');

    putmodel.addEventListener('click', () => {
 


      model.position.setFromMatrixPosition(reticle.matrix);
      //mesh.scale.y = Math.random() * 2 + 1;
      scene.add(model);
    });

    turnXButtonpos.addEventListener("click",()=>{
        model.rotation.y+=.03;

        });
    turnXButtonneg.addEventListener("click",()=>{
        model.rotation.y-=.03;
        });

    renderer.xr.addEventListener("sessionstart", async (e) => {
      putmodel.style.display = 'inline';
      turnXButtonneg.style.display = 'inline';
      turnXButtonpos.style.display = 'inline';
      const session = renderer.xr.getSession();
      const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
      const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});

      renderer.setAnimationLoop((timestamp, frame) => {
	if (!frame) return;

	const hitTestResults = frame.getHitTestResults(hitTestSource);
  

	if (hitTestResults.length) {
	  const hit = hitTestResults[0];
	  const referenceSpace = renderer.xr.getReferenceSpace(); // ARButton requested 'local' reference space
	  const hitPose = hit.getPose(referenceSpace);

	  reticle.visible = true;
	  reticle.matrix.fromArray(hitPose.transform.matrix);
	} else {
	  reticle.visible = false;
	}

	renderer.render(scene, camera);
      });
    });

    renderer.xr.addEventListener("sessionend", () => {
        renderer.clear();
        
        putmodel.style.display = 'none';

        renderer.setAnimationLoop(null);

    });

  }

  initialize();
});


