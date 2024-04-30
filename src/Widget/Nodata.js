import imageUrl from "../assets/Nodata.png"



const NoData = ({ text }) => {
  return (
    <div className="flex justify-center items-center w-full p-20 flex-col">
      <div className="flex flex-col justify-center items-center">
        <img src={imageUrl} alt="No Data..." className="max-w-full h-auto"  style={{marginTop:"-7em"}}/>
        <span className="mt-4 text-[16px] text-lightBlack font-semibold">{text ?? "No Data"}</span>
      </div>
    </div>
  );
};

export default NoData;
