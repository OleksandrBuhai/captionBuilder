export default function Presentation() {
    const video = '/presentationVideo.mp4'; 
  
    return (
      <div className="mt-5 rounded-xl flex flex-col items-center">
        <span className="text-white text-xl my-2">
            Watch video presentation how it works, if you are intresting in this app, press Contact, and write me message.
        </span>
        <video controls>
          <source src={video} type="video/mp4" />
        </video>
      </div>
    );
  }