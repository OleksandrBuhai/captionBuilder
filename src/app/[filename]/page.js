'use client'

import axios from "axios"
import { useEffect, useState } from "react"

export default function FilePage({ params }) {

    const [inProgress, setInProgress] = useState(false)
    const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([])

    const fileName = params.filename

    useEffect(() => {

        getTranscription()

    }, [fileName]);


    function getTranscription() {
        axios.get('/api/transcription?filename=' + fileName)
            .then(response => {
                const status = response.data?.status;
                const transcription = response.data?.transcription
                if (status === 'IN_PROGRESS') {
                    setInProgress(true)
                    setTimeout(getTranscription, 3000)
                } else {
                    setInProgress(false)
                    setAwsTranscriptionItems(transcription.results.items)
                }
            })
    }

    return (
        <div className="text-3xl text-black">{fileName}
            <div>
                {awsTranscriptionItems.length > 0 &&
                    awsTranscriptionItems.map(el => (
                        <div>
                            <span className="text-white/50">
                                {el.start_time} - {el.end_time}
                            </span>
                            <span className="text-white">
                                {el.alternatives[0].content}
                            </span>
                        </div>
                    ))}
            </div>
        </div>
    )
}