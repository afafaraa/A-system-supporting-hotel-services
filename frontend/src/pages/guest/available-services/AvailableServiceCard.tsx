import {Card, CardContent, CardMedia, Typography} from "@mui/material";
import StarRating from "./StarRating.tsx";
import {useNavigate} from "react-router-dom";

function AvailableServiceCard({service}) {
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
        sx={{height: '40%'}}
        component="img"
        image={service.image}
        alt="Alt"
      />
      <CardContent sx={{padding: '0', paddingX: '10px', paddingTop: '10px'}}>
        <div>
          <Typography sx={{fontWeight: 'bold'}} variant="h6">{service.name}</Typography>
          <p style={{fontSize: '13px'}}>{service.description}</p>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <StarRating rating={service.rating} />
          <div style={{fontWeight: 'bold'}}>{service.price}$ </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AvailableServiceCard;