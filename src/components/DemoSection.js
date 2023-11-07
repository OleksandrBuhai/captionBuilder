import SparklesImg  from "./SparklesImg"



const DemoSection =()=>{

    return (
        <section className='flex  justify-around items-center mt-8 '>
        <div className=' bg-gray-800/50 w-[240px] h-[480px]'></div>
        <div className='text-[#f64c72] '><SparklesImg className='w-20 h-20'/></div>
        <div className=' bg-gray-800/50 w-[240px] h-[480px]'></div>
      </section>
    )

}

export default  DemoSection