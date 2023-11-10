

const PagesHeader = ({header="", subHeader=''}) => {
    return (

        <section className='flex flex-col items-center  gap-5 mt-10'>
        <h1 className='text-5xl font-bold text-white'>{header}</h1>
        <h2 className='text-2xl text-white'>{subHeader}</h2>
 
      </section>
    )
}

export default PagesHeader