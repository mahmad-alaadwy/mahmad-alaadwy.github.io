import {GLTFLoader} from './GLTFLoader.js';

async function loadmodel(path){
    const loader=new GLTFLoader();
    const modelData =await loader.loadAsync(path);
    const model = modelData.scene;
    model.scale.set(1,1,1);

    //model.position.set(2,.02,1);
    return {model};
}
export{loadmodel};
