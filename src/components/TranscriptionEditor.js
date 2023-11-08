import TranscriptionItem from "./TranscriptionItem"


export default function TranscriptionEditor({
    awsTranscriptionItems,
    setAwsTranscriptionItems }) {

    function updateTranscriptionItem(index, prop, e) {
        const newAwsItem = [...awsTranscriptionItems]
        newAwsItem[index][prop] = e.value
        setAwsTranscriptionItems(newAwsItem)
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-1 sticky top-0 text-white">
                <div className="w-24">From</div>
                <div className="w-24">End</div>
                <div className="w-30">Content</div>
            </div>
            {awsTranscriptionItems.length > 0 &&
                awsTranscriptionItems.map((el, index) => (
                    <div key={index}>
                        <TranscriptionItem
                            item={el}
                            handleStartTimeChange={(e) => {
                                updateTranscriptionItem(index, 'start_time', e)
                            }}
                            handleEndTimeChange={(e) => {
                                updateTranscriptionItem(index, 'end_time', e)
                            }}
                            handleContentChange={(e) => {
                                updateTranscriptionItem(index, 'content', e)
                            }} />
                    </div>
                ))}
        </>
    )
}