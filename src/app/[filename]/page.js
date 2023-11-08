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
                    setInProgress(true)
                    setTimeout(getTranscription, 3000)
                } else {
                    setInProgress(false)
                    setAwsTranscriptionItems(
                    clearTransriotionItems(transcription.results.items))
                }
            })
    }



    if (isTranscribing) {
        return (
            <div>Transcribing your video</div>
        )
    }

    if (isFetchingInfo) {
        return (
            <div>Fetching your video</div>
        )
    }

    return (
        <div >
            <div className="grid grid-cols-2 gap-8">
                <div className="">
                    <h2 className="text-2xl mb-4 text-white/80">
                        Transcription
                    </h2>
                    <TranscriptionEditor awsTranscriptionItems={awsTranscriptionItems}
                        setAwsTranscriptionItems={setAwsTranscriptionItems} />
                </div>
                <ResultVideo fileName={fileName}
                transcriptionItems = {awsTranscriptionItems} />
            </div>
        </div>
    )
}