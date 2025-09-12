import {Card, CardContent, CardMedia, Typography, CardActions} from "@mui/material";
import StarRating from "./StarRating.tsx";
import {useNavigate} from "react-router-dom";
import {Rating} from "../../../types";

export type ServiceProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rating: Rating[];
}

function AvailableServiceCard({service}: {service: ServiceProps}) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/service-schedule/${service.id}`, {state: service})} elevation={8}
          sx={{display: 'flex', flexDirection: 'column', cursor: 'pointer',
            height: {xs: '60vh',sm: '42vh'},
            '&:hover': {transform: 'scale(1.05)'}, transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}>
      <CardMedia
        sx={{height: '55%'}}
        component="img"
        image={service.image}
        alt={service.name + " image"}
      />
      <CardContent sx={{padding: '5px 15px'}}>
        <Typography sx={{fontWeight: 'bold', fontSize: {xs: '2em', sm:'1.3em'}}} variant="h6">{service.name}</Typography>
        <Typography sx={{fontSize: {xs: '1em',sm: '0.8em'}, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis'}}>{service.description}</Typography>
      </CardContent>
      <CardActions sx={{mt: 'auto', padding: '0 15px 15px 15px', fontSize: {xs: '1.3em', sm: '1em'}, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <StarRating rating={service.rating}/>
        <div style={{fontWeight: 'bold'}}>{service.price.toFixed(2)}$</div>
      </CardActions>
    </Card>
  )
}

export default AvailableServiceCard;
