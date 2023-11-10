import { useEffect, useRef, useState } from "react";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import SparklesImg from "./SparklesImg";
import { transcriptionItemsToSrt } from "@/libs/awsTranscriptionHelpers";
import roboto from './../fonts/Roboto-Regular.ttf';
import robotoBold from './../fonts/Roboto-Bold.ttf';

export default function ResultVideo({ fileName, transcriptionItems }) {

    const videoUrl = "https://olek-bucket.s3.amazonaws.com/" + fileName
    const [videoSrc, setVideoSrc] = useState('0')
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);
    const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
    const [outlineColor, setOutlineColor] = useState('#000000');
    const [fontSize, setFontSize] = useState(10)
    const [progress, setProgress] = useState(1)

    useEffect(() => {
        videoRef.current.src = videoUrl
        load()
    }, [])

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd'
        const ffmpeg = ffmpegRef.current
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        await ffmpeg.writeFile('/tmp/roboto.ttf', await fetchFile(roboto))
        await ffmpeg.writeFile('/tmp/roboto-bold.ttf', await fetchFile(robotoBold))
        setLoaded(true);
    }

    function toFFmpegColor(rgb) {
        const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
        return '&H' + bgr + '&';
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        const srt = transcriptionItemsToSrt(transcriptionItems)
        await ffmpeg.writeFile(fileName, await fetchFile(videoUrl));
        await ffmpeg.writeFile('subs.srt', srt)
        videoRef.current.src = videoUrl
        await new Promise((res, rej) => {
            videoRef.current.onloadedmetadata = res
        })

        const duration = videoRef.current.duration


        ffmpeg.on('log', ({ message }) => {
            const regexResult = /time=([0-9:.]+)/.exec(message);
            if (regexResult && regexResult?.[1]) {
                const timeValue = regexResult?.[1];
                const [hours, minutes, seconds] = timeValue.split(':')
                const doneTotal = hours * 3600 + minutes * 60 + seconds
                const videoProgress = doneTotal / duration
                setProgress(videoProgress)
            }
        });

        await ffmpeg.exec(['-i', fileName,
            '-preset', 'ultrafast',
            '-vf', `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto Bold,FontSize=${fontSize},MarginV=70,PrimaryColour=${toFFmpegColor(primaryColor)},OutlineColour=${toFFmpegColor(outlineColor)}'`,
            'output.mp4']);
        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        setProgress(1)
    }


    return (
        <>
            <div className="" >
                <h2 className="text-2xl mb-4 text-white/80">
                    Results
                </h2>
          <div className="flex items-center flex-col">
                <div className="md:flex   grid grid-cols-2 text-white  mb-5">
                    <div className="md:flex grid grid-cols-2 items-center gap-2">
                    Text color:
                    <input type="color"
                        value={primaryColor}
                        onChange={ev => setPrimaryColor(ev.target.value)} />
                    Outline color:
                    <input type="color"
                        value={outlineColor}
                        onChange={ev => setOutlineColor(ev.target.value)} />

                    Text Size:
                    <input type='number'
                        className="text-black w-[5rem]"
                        value={fontSize}
                        onChange={e => setFontSize(e.target.value)}
                    />
                     <button
                        onClick={transcode}
                        className='bg-[#f64c72]  rounded-xl  text-white  flex flex-row p-1 mx-auto cursor-pointer '>
                        <SparklesImg />
                        <span>Put captions</span>
                    </button>
                    </div>
                </div>
                <div className="w-[20rem]">
                <div className="rounded-xl overflow-hidden relative ">
                    {progress && progress < 1 && (
                        <div className="absolute inset-0 bg-black/80 flex items-center">
                            <div className="w-full text-center">
                                <div className="bg-bg-gradient-from/50 mx-8 rounded-lg overflow-hidden relative">
                                    <div className="bg-bg-gradient-from h-8"
                                        style={{ width: progress * 100 + '%' }}>
                                        <h3 className="text-white text-xl absolute inset-0 py-1">
                                            {parseInt(progress * 100)}%
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <video 
                        data-video={0}
                        ref={videoRef}
                        controls>
                    </video>
                </div>
                </div>
                </div>
            </div>
        </>
    )
}