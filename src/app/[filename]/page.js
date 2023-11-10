'use client'

import axios from "axios"
import { useEffect, useState } from "react"
import { clearTransriotionItems } from '@/libs/awsTranscriptionHelpers'
import TranscriptionEditor from '@/components/TranscriptionEditor'
import ResultVideo from "@/components/ResultVideo"


export default function FilePage({ params }) {

    const [inProgress, setInProgress] = useState(false)
    const [isTranscribing, setIsTranscrabing] = useState(false)
    const [isFetchingInfo, setIsFetchingInfo] = useState(false)
    const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([])

    const fileName = params.filename

    useEffect(() => {

        getTranscription()

    }, [fileName]);


    function getTranscription() {
        setIsFetchingInfo(true)
        axios.get('/api/transcription?filename=' + fileName)
            .then(response => {
                setIsFetchingInfo(false)
                const status = response.data?.status;
                const transcription = response.data?.transcription
                if (status === 'IN_PROGRESS') {
                    setIsTranscrabing(true)
                    setTimeout(getTranscription, 3000)
                } else {
                    setIsTranscrabing(false)
                    setAwsTranscriptionItems(
                        clearTransriotionItems(transcription.results.items))
                }
            })
    }



    if (isTranscribing) {
        return (
            <div className="flex flex-row gap-5">
            <div className="text-white text-3xl">Transcribing your video. Please wait </div>
                <div className="animate-spin h-6 w-6 ml-2 border-t-4 border-white"></div>
           
            </div>
        )
    }

    if (isFetchingInfo) {
        return (
            <div className="flex flex-row gap-5">
            <div className="text-white text-3xl ">Fetching your video. Please wait   </div>
                <div className="animate-spin h-6 w-6 ml-2 border-t-4 border-white"></div>
         
            </div>
        )
    }

    return (
        <>

            <div className="" >
                <div className="md:grid md:grid-cols-2 md:gap-8 flex-col ">
                    <div className="">
                        <h2 className="text-2xl mb-4 text-white/80 ">
                            Transcription
                        </h2>
                        <TranscriptionEditor awsTranscriptionItems={awsTranscriptionItems}
                            setAwsTranscriptionItems={setAwsTranscriptionItems} />
                    </div>

                    <ResultVideo fileName={fileName}
                        transcriptionItems={awsTranscriptionItems} />
                </div>
            </div>
        </>
    )
}