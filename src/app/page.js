import DemoSection from "@/components/DemoSection";
import PagesHeader from "@/components/PagesHeader";
import UploadIcon from "@/components/UploadIcon";




export default function Home() {
  return (
    <>
    <section className='flex flex-col items-center'>
      <PagesHeader header='Add caption to your video' subHeader='Just upload video and we make all magic '/>
    <div className='mt-10'>
        <button className='bg-[#f64c72]  rounded-xl  text-white s flex flex-row gap-2  max-w-xs mx-auto p-4 '>
         <UploadIcon/>
          Chose file</button>
          </div>
          </section>
      <DemoSection/>

    </>
  )
}
