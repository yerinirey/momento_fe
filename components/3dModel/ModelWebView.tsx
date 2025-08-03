// import { View } from "tamagui";
// import { WebView } from "react-native-webview";
// export default function ModelWebView({ modelUrl }: { modelUrl: string }) {
//   const cleanedModelUrl = modelUrl.replace(/([^:]\/)\/+/g, "$1");
//   console.log(cleanedModelUrl);
//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <style>
//         html, body {
//           margin: 0;
//           padding: 0;
//           height: 100%;
//           overflow: hidden;
//           background-color: #909291;
//         }
//         canvas {
//           width: 100%;
//           height: 100%;
//           display: block;
//         }
//       </style>

//       <!-- External libraries -->
//       <script src="https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js"></script>
//       <script src="https://cdn.jsdelivr.net/npm/three@0.152.2/examples/js/loaders/GLTFLoader.js"></script>
//       <script src="https://cdn.jsdelivr.net/npm/three@0.152.2/examples/js/controls/OrbitControls.js"></script>
//     </head>
//     <body>
//       <pre id="logs" style="position: absolute; top: 0; left: 0; color: red; z-index: 999;"></pre>

//       <script>
//         const logContainer = document.getElementById('logs');

//         const RNPost = (payload) => {
//           if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
//             window.ReactNativeWebView.postMessage(JSON.stringify(payload));
//           }
//         };

//         console.log = (...args) => {
//           const log = JSON.stringify(args);
//           logContainer.textContent += log + '\\n';
//           RNPost({ type: 'log', payload: args });
//         };

//         console.error = (...args) => {
//           const log = 'ERROR: ' + JSON.stringify(args);
//           logContainer.textContent += log + '\\n';
//           RNPost({ type: 'error', payload: args });
//         };

//         console.log('Script started.');
//         console.log('Model URL:', '${cleanedModelUrl}');

//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0xffffff);
//         const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         camera.position.set(0, 1, 2);
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         document.body.appendChild(renderer.domElement);

//         const controls = new THREE.OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;

//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//         scene.add(ambientLight);

//         const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//         directionalLight.position.set(0, 1, 1);
//         scene.add(directionalLight);

//         const loader = new THREE.GLTFLoader();
//         loader.load(
//           '${cleanedModelUrl}',
//           function (gltf) {
//             scene.add(gltf.scene);
//             console.log('✅ GLTF loaded');
//           },
//           undefined,
//           function (error) {
//             console.error('❌ Failed to load GLTF:', error);
//           }
//         );

//         function animate() {
//           requestAnimationFrame(animate);
//           controls.update();
//           renderer.render(scene, camera);
//         }

//         animate();
//       </script>
//     </body>
//     </html>
//     `;

//   const onMessage = (event: any) => {
//     try {
//       const message = JSON.parse(event.nativeEvent.data);
//       if (message.type === "log") {
//         console.log("WebView Log:", ...message.payload);
//       } else if (message.type === "error") {
//         console.error("WebView Error:", ...message.payload);
//       }
//     } catch (err) {
//       console.error("Failed to parse message from WebView:", err);
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <WebView
//         originWhitelist={["*"]}
//         source={{ html: htmlContent }}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         onMessage={onMessage}
//         mixedContentMode="always"
//         allowFileAccess={true}
//         allowUniversalAccessFromFileURLs={true}
//       />
//     </View>
//   );
// }
