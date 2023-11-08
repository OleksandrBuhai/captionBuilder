import DemoSection from "@/components/DemoSection";
import PagesHeader from "@/components/PagesHeader";
import UploadForm from "@/components/UploadForm";




export default function Home() {
  return (
    <>
      <section className='flex flex-col items-center'>
        <PagesHeader header='Add caption to your video' subHeader='Just upload video and we make all magic ' />
        <UploadForm />
      </section>
      <DemoSection />

    </>
  )
}
