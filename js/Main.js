var camera, scene, renderer,
    width = window.innerWidth,
    height = window.innerHeight,
    lastAnimTime = window.performance.now(),
    fishArr = [],
    // mod_start_2020/04/02
    //AMOUNT_OF_FISH = 200,
    AMOUNT_OF_FISH = 300,
    // mod_end
    WORLD_SIZE = 2000,
    RENDER_INTERVAL = 30,
    TICK_INTERVAL = 500;

// mod_start_2020/04/01
// var assetsPath = 'https://s3-ap-northeast-1.amazonaws.com/niisan-tokyo-threejs-playground/treee_assets/tuna/';
var assetsPath = 'models/tgrs_shark/';
// mod_end
loadOBJ( animate );
init();
// render();
// animate();

function init() {

    // rendererの設定 ------------------------------
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor( 0x112045 ); // 背景色
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    // scene追加 ------------------------------
    scene = new THREE.Scene();

    //  cameraの設定 ------------------------------
    var perscamera = new THREE.PerspectiveCamera( 45, width / height, 1, 10000 ); // fov(視野角),aspect,near,far
    var orthocamera = new THREE.OrthographicCamera( width / -2, width / 2, height / 2, height / -2, 1, 10000 );
    camera = perscamera;
    camera.position.set(100, -50, 100);
    camera.up.set(0, 1, 0);
    camera.lookAt({ x:0, y:0, z:0 });

    // add light ------------------------------
    // 海っぽい感じに
    var light = new THREE.DirectionalLight( 0xeeeeff );
    light.position.set( 0, 1, 0 );
    scene.add( light );

    var light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    scene.add( light );

    var light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    var light = new THREE.AmbientLight( 0x444444 );
    scene.add( light );

    // controls ------------------------------
    // OrbitControlsを追加しつつautoでも回転させる
    controls = new THREE.OrbitControls(camera);
    // controls.userPan = false;
    // controls.userPanSpeed = 0.0;
    controls.maxDistance = 5000.0;
    // controls.maxPolarAngle = Math.PI * 0.495;
    controls.autoRotate = true;     //true:自動回転する,false:自動回転しない
    controls.autoRotateSpeed = 1.0;    //自動回転する時の速度

    // axis ------------------------------
    // test用にxyz軸表示
    // var axis = new THREE.AxisHelper(1000);
    // axis.position.set(0,0,0);
    // scene.add(axis);

}

function animate () {
    requestAnimationFrame( animate );
    var time = Date.now() * 0.0005;

    // fishたちにアニメーションをつける ------------------------------
    for ( var i = 0; i < AMOUNT_OF_FISH; i ++ ) {
      var fish = fishArr[i];

      //泳ぐ速度
      fish.position.z += 3 + (fish.speed);
      //横の揺れ
      fish.position.x += Math.sin( time * (0.7 + fish.randSeed/3)) * 0.5;
      // fish.position.y += ( Math.random(0.5,1) );
      //上下回転
      fish.rotation.x = ( Math.PI / 100 )* Math.sin( time * 6 + fish.speed * 100);
      //横回転
      fish.rotation.y = ( Math.PI / 20 )* Math.sin( time * 20 + fish.speed * 100);
      // 一定値超えると、初期に戻る
      if(fish.position.z > WORLD_SIZE/2){
        fish.position.x = ( Math.random() - 0.5 ) * WORLD_SIZE/2;
        fish.position.y = ( Math.random() - 0.5 ) * WORLD_SIZE/2;
        fish.position.z = -1 * WORLD_SIZE/2
      }
    }
    // console.log(fishArr[0].position.x);
    render();
}

function render(){
    renderer.render( scene, camera );
    controls.update();
}

function loadOBJ( callback ) {
    // obj mtl を読み込んでいる時の処理 ------------------------------
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    // obj mtl が読み込めなかったときのエラー処理 ------------------------------
    var onError = function ( xhr ) {    };

    // obj mtlの読み込み ------------------------------
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( assetsPath );              // this/is/obj/path/
    // mtl読み込み
    // mod_start_2020/04/01
    // mtlLoader.load( 'tuna_r.mtl', function( materials ) {
    mtlLoader.load( 'TGRSHARK.MTL', function( materials ) {
	// mod_end
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( assetsPath );            // this/is/obj/path/
        // obj読み込み
        // mod_start_2020/04/01
        // objLoader.load( 'tuna_r.obj', function ( object ) {
        objLoader.load( 'TGRSHARK.OBJ', function ( object ) {
		// mod_end
            objmodel = object.clone();
            // mod_start_2020/04/02
            //var scale = 30;
            var scale = 10;
            // mod_end
            objmodel.scale.set(scale, scale, scale);      // 縮尺の初期化
            objmodel.rotation.set(0, 0, 0);         // 角度の初期化
            objmodel.position.set(0, 0, 0);         // 位置の初期化

            // objをObject3Dで包む
            // obj = new THREE.Object3D();
            // obj.add(objmodel);
            
            // scene.add(obj);                         // sceneに追加

            for ( var i = 0; i < AMOUNT_OF_FISH; i ++ ) {
                fishArr[i] = new THREE.Object3D();
                var fishmodel = objmodel.clone();
                var fish = fishArr[i];
                fish.add(fishmodel);

                fish.name = "fish-" + i;
                fish.speed = Math.random() - 0.5;
                fish.randSeed = Math.random(); //波形とかずらすやつに使う
                fish.position.x = ( Math.random() - 0.5 ) * WORLD_SIZE/2;
                fish.position.y = ( Math.random() - 0.5 ) * WORLD_SIZE/2;
                fish.position.z = ( Math.random() - 0.5 ) * WORLD_SIZE;
                var scale = fish.speed + 1 + Math.random(-1,1) * 0.1  ;
                fish.scale.set(scale, scale, scale);
                fish.updateMatrix();
                // fish.useQuaternion = true;

                scene.add(fish);                         // sceneに追加
            }
            
            // load後処理
            callback();

        }, onProgress, onError );
    });
}
