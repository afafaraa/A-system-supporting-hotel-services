import {Card, CardContent, CardMedia, Typography, Box} from "@mui/material";
import StarRating from "./StarRating.tsx";
import {useNavigate} from "react-router-dom";

export type ServiceProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: Rating[];
}

export type Rating = {
  fullName: string;
  rating: number;
  comment: string;
}

function AvailableServiceCard({service}: {service: ServiceProps}) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/service-schedule/${service.id}`)} elevation={0} sx={{height: {xs: '60vh',sm: '42vh',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          cursor: 'pointer',
        },
      }}}>
      <CardMedia
        sx={{height: '55%'}}
        component="img"
        image={service.image}
        alt="Alt"
      />
      <CardContent sx={{padding: '5px 15px', height: '45%'}}>
        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center'}}>
          <div>
            <Typography sx={{fontWeight: 'bold', fontSize: {xs: '2em', sm:'1.3em'}}} variant="h6">{service.name}</Typography>
            <Typography sx={{fontSize: {xs: '1em',sm: '0.8em'}}}>{service.description}</Typography>
          </div>
          <Box sx={{fontSize: {xs: '1.3em', sm: '1em'},width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px'}}>
            <StarRating rating={service.rating}/>
            <div style={{fontWeight: 'bold'}}>{service.price.toFixed(2)}$</div>
          </Box>
        </div>

      </CardContent>
    </Card>
  )
}

export default AvailableServiceCard;
