import PagesHeader from "@/components/PagesHeader";



const Pricing = () => {
  return (
    <>
      <PagesHeader
        header={'Check out our pricing'}
        subHeader={'Our pricing is very simple'}
      />
      <div className="bg-white text-slate-700 rounded-lg max-w-xs mx-auto p-4 text-center my-20">
        <h3 className="font-bold text-3xl">Free</h3>
        <h4>Free forever</h4>
      </div>
    </>
  );
};

export default Pricing;
