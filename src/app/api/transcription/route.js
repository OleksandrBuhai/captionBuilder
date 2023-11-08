import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { GetTranscriptionJobCommand, StartTranscriptionJobCommand, TranscribeClient } from "@aws-sdk/client-transcribe";

function getClient() {
    return new TranscribeClient({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.AWS_ACCESSS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
}

function createTranscriptionCommand(fileName) {
    return new StartTranscriptionJobCommand({
        TranscriptionJobName: fileName,
        OutputBucketName: process.env.BUCKET_NAME,
        OutputKey: fileName + '.transcription',
        IdentifyLanguage: true,
        Media: {
            MediaFileUri: 's3://' + process.env.BUCKET_NAME + '/' + fileName,
        },
    });
}

async function createTranscriptionJob(fileName){
   const transcribeClient = getClient()
    const transcriptionCommand = createTranscriptionCommand(fileName)
    return  await transcribeClient.send(transcriptionCommand);
}

async function getJob(fileName){
    const transcribeClient = getClient()
    let jobStatusResult = null
    try {
        const transcriotionJobStatusCommand = new GetTranscriptionJobCommand({
            TranscriptionJobName:fileName
        });
    
         jobStatusResult = await transcribeClient.send(transcriotionJobStatusCommand);
    
    } catch(e){}
    return jobStatusResult
   }

   async function streamToString(stream){
    const chunks = []
        return new Promise((res,rej)=>{
            stream.on('data', chunk=> chunks.push(Buffer.from(chunk)))
            stream.on('end',()=> res(Buffer.concat(chunks).toString('utf8')))
            stream.on('error',rej)
        })
   }

   async function getTranscriptionFile(filename) {
    const transcriptionFile = filename + '.transcription';
    const s3client = new S3Client({
        region: 'us-east-2',
        credentials: {
          accessKeyId: process.env.AWS_ACCESSS_KEY ,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: transcriptionFile,
    });
    let transcriptionFileResponse = null;
    try {
      transcriptionFileResponse = await s3client.send(getObjectCommand);
    } catch (e) {}
    if (transcriptionFileResponse) {
        return JSON.parse( await streamToString(transcriptionFileResponse.Body))
        
    }
    return null
   
  }

export async function GET(req) {

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const fileName = searchParams.get('filename');
    

   
  const transcription = await getTranscriptionFile(fileName)
  if(transcription){
    return Response.json({
        status:'COMPLETED',
        transcription
    })
  }
    
    const existingJob = await getJob(fileName)

    if(existingJob){
        return Response.json({
            status:existingJob.TranscriptionJob.TranscriptionJobStatus,
        })
    }

    if (!existingJob) {
        const newJob = await createTranscriptionJob(fileName)
        
        return Response.json({
            status: newJob.TranscriptionJob.TranscriptionJobStatus,
        })
    }

    return Response.json(null);


}