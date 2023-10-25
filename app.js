import gaze from 'gaze-detection';
import { Rive } from '@rive-app/canvas';

import LookRiveFile from 'data-url:./look.riv';

async function main() {
	const videoElement = document.querySelector('#video');
	const videoCanvas = document.querySelector('#video-canvas');
	const riveCanvas = document.querySelector('#rive-canvas');
	const videoCtx = videoCanvas.getContext('2d');

	const OFFSCREEN_GAZES = ['RIGHT', 'LEFT'];

	const riveInstance = new Rive({
		src: LookRiveFile,
		autoplay: true,
		canvas: riveCanvas,
		stateMachines: 'State Machine 1',
		onLoad: async () => {
			const isStaringInput =
				riveInstance.stateMachineInputs('State Machine 1')[0];

			const initGaze = async () => {
				await gaze.loadModel();
				await gaze.setUpCamera(videoElement);

				videoCtx.translate(500, 0);
				videoCtx.scale(-1, 1);

				const predict = async () => {
					// return TOP, CENTER, LEFT RIGHT

					const gazePrediction = await gaze.getGazePrediction();

					if (OFFSCREEN_GAZES.indexOf(gazePrediction) > -1) {
						isStaringInput.value = true;
					} else {
						isStaringInput.value = false;
					}
					videoCtx.drawImage(
						videoElement,
						0,
						0,
						videoElement.videoWidth,
						videoElement.videoHeight
					);
					requestAnimationFrame(predict);
				};
				await predict();
			};
			await initGaze();
		},
	});
}

main();
