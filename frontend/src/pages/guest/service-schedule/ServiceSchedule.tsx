import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../../middleware/axiosApi.ts";

function ServiceSchedule (){
  const params = useParams();
  const [service, setService] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    fetchData();
  },[])


  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axiosAuthApi.get("/service-schedule");
      setService(response.data);

      console.log(service)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  if(loading){
    return <p>Loading...</p>;
  }
  return (
    <div>
      Service {params.id}
    </div>
  )
}

export default ServiceSchedule;
