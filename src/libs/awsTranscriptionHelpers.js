export function clearTransriotionItems(items){
  items.forEach((el,key)=>{
        if(!el.start_time){
            items[key - 1].alternatives[0].content +=  el.alternatives[0].content
            delete items[key]
        }
    });
    return items.map(el=> {
        const {start_time, end_time} = el
        const content = el.alternatives[0].content
        return {start_time, end_time, content}})
}

function secondsToHHMM(timeString){
    const d = new Date(parseFloat(timeString) * 1000);
    return d.toISOString().slice(11,23).replace('.', ',');
  
}

export function transcriptionItemsToSrt (items){
    let srt = ''
    let i = 1
    items.forEach(el => {

        srt += i + "\n"

        const { start_time, end_time}  = el
    
        srt +=  secondsToHHMM(start_time) + ' --> ' + secondsToHHMM(end_time) + '\n'
       
        srt += el.content + "\n"
        
        srt += "\n"

        
        i++
    })
    return srt
}