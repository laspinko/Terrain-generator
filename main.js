function load_resources() {
  var promises = []

  promises.push(fetch("shaders/default.vert")
  .then(res => res.text()))

  promises.push(fetch("shaders/default.frag")
  .then(res => res.text()))

  return Promise.all(promises).then(res => ({
    "vert": res[0],
    "frag": res[1]
  }))
}

/*

    Create the scene

*/

function initialise_scene(shaders) {
  // You can use your loaded resources here; shaders.vert will be the vertex shader, for example
  var scene = new THREE.Scene();
  scene.background = new THREE.Color("#AAAAAA");
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 15;
  camera.lookAt(scene.position);
  camera.updateMatrixWorld(camera);

  
  // Set up the renderer
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(2);
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  //camera controls
  var controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.listenToKeyEvents(window)
  
  console.log(camera)
  
  var time = 0;
  
  // Add things to your scene here

  //planet
  var sphere_geometry = new THREE.IcosahedronGeometry(3, 10);
  
  var sphere_color_palette = 
    [{color: new THREE.Color('darkblue'), amplitude: -1},
     {color: new THREE.Color('#FF00FF'), amplitude: 0},
     {color: new THREE.Color('#AF00AF'), amplitude: 0.01},
     {color: new THREE.Color('yellow'), amplitude: 0.01},
     {color: new THREE.Color('red'), amplitude: 0.3}];
  
  var sphere_material = new THREE.ShaderMaterial({
    uniforms: { color_palette: {value: sphere_color_palette},
                diffuse_color: {value: new THREE.Color('#CFCFFF')},
                specular_color: {value: new THREE.Color('#CFCFFF')},
                light_source: {value: new THREE.Vector3(100,100,100)}, 
                world_camera: {value: camera.position},
                bump_magnitude: {value: .5},
                bump_layers: {value: 4},
                water: {value: true}},
    side: THREE.FrontSide,
    vertexShader: shaders["vert"],
    fragmentShader: shaders["frag"]
  });
  var sphere = new THREE.Mesh(sphere_geometry, sphere_material);
  
  scene.add(sphere);
  
  //teapot moon
  var teapot_geometry = new THREE.TeapotGeometry( 0.7,15,true,true,true,true,true);
  
  var teapot_color_palette = 
    [{color: new THREE.Color('darkblue'), amplitude: -1},
     {color: new THREE.Color('#FFFFFF'), amplitude: 0},
     {color: new THREE.Color('#964B00'), amplitude: 0.01},
     {color: new THREE.Color('#80C910'), amplitude: 0.1},
     {color: new THREE.Color('#00FF20'), amplitude: 0.3}];
     
  var teapot_material = new THREE.ShaderMaterial({
    uniforms: { color_palette: {value: teapot_color_palette},
                diffuse_color: {value: new THREE.Color('#CFCFFF')},
                specular_color: {value: new THREE.Color('#8F8FFF')},
                light_source: {value: new THREE.Vector3(100,100,100)}, 
                world_camera: {value: camera.position},
                bump_magnitude: {value: .4},
                bump_layers: {value: 4},
                water: {value: true}},
    side: THREE.DoubleSide,
    vertexShader: shaders["vert"],
    fragmentShader: shaders["frag"]
  });
  
  var teapot = new THREE.Mesh(teapot_geometry, teapot_material);
  teapot.position.x = 4;
  teapot.position.y = 4;
  teapot.position.z = -4;
  scene.add(teapot);

  // Your animation loop, which will run repeatedly and renders a new frame each time
  var animate = function () {
      teapot.position.x = Math.sin(time) * 7;
      teapot.position.y = Math.cos(time) * 7;
      teapot.position.z = Math.sin(time) * 7;
      time += 0.001;
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
  };

  animate();
}

// Load the resources and then create the scene when resources are loaded
load_resources().then(res => initialise_scene(res))
