import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import Box from "@mui/system/Box";
import {Button, Grid, MenuItem, Select, SelectChangeEvent, Stack, Typography} from "@mui/material";
import {Dispatch, SetStateAction, useState} from "react";

interface OptionObject {
  label: string;
  description: string;
  price: number;
  image?: string;
}

export interface Selection {
  multipleSelection: boolean;
  options: Record<string, OptionObject[]>
}

interface OrderItem {
  option: OptionObject;
  quantity: number;
}

function OptionCardButtons({option, setOrder}: {option: OptionObject, setOrder: Dispatch<SetStateAction<OrderItem[]>>}) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event: SelectChangeEvent) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleAddToOrder = () => {
    setOrder(prev => {
      const existingItemIndex = prev.findIndex(item => item.option.label === option.label);
      if (existingItemIndex !== -1) {
        const updatedOrder = [...prev];
        updatedOrder[existingItemIndex].quantity += quantity;
        console.log(existingItemIndex, updatedOrder[existingItemIndex].quantity);
        return updatedOrder;
      } else {
        console.log(prev, option, quantity);
        return [...prev, {option: option, quantity}];
      }
    })
    setQuantity(1);
  }

  return (
    <Stack direction="row" alignItems="center" gap={1} mt={1}>
      <Button size="small" variant="outlined" sx={{borderRadius: "12px"}} onClick={handleAddToOrder}>Dodaj do zamówienia</Button>
      <Select size="small" variant="outlined" type="number" value={quantity.toString()} onChange={handleQuantityChange} sx={{fontSize: "0.8125rem", height: "32px"}}>
        {Array.from({length: 10}, (_, i) => i + 1).map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
      </Select>
    </Stack>
  )
}

interface Props {
  type: string;
  details: Selection
}

function ServiceSelectionCard({type, details}: Props) {
  const [order, setOrder] = useState<OrderItem[]>([]);
  console.log(order);
  return (<>
    <SectionCard>
      <p>Type: {type}</p>
      <p>{details.multipleSelection ? 'Multiple selection allowed' : 'Single selection only'}</p>
      {Object.entries(details.options).map(([key, options]) => (
        <Box key={key} mt={2}>
          <Typography fontSize="120%" fontWeight="bold">{key}</Typography>
          <Grid container gap={2} columns={{xs: 1, md: 2}} mt={1}>
            {options.map((option, index) => (
              <Grid key={option.label} size="grow">
                <SectionCard clickable size={1} key={index} width="100%" display="flex" alignItems="center" justifyContent="space-between">
                  <Box p={1}>
                    <Typography fontSize="110%" fontWeight="500">{option.label}</Typography>
                    <Typography fontSize="90%" color="text.secondary">{option.description}</Typography>
                    <OptionCardButtons option={option} setOrder={setOrder}/>
                  </Box>
                  <Box width="120px" height="120px" overflow="hidden" flexShrink={0} borderRadius="inherit">
                    <img src={option.image} alt={option.label + " image"} style={{objectFit: 'cover', width: "100%", height: "100%"}} />
                  </Box>
                </SectionCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </SectionCard>
    <SectionCard mt="inherit">
      {order.length === 0 ? <Typography>Brak wybranych opcji</Typography> : (
        <Stack gap={2}>
          {order.map((item, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography fontSize="110%" fontWeight="500">{item.option.label}</Typography>
                <Typography fontSize="90%" color="text.secondary">Ilość: {item.quantity}</Typography>
              </Box>
              <Typography fontSize="110%" fontWeight="500">{(item.option.price * item.quantity).toFixed(2)} PLN</Typography>
            </Box>
          ))}
          <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} borderTop="1px solid" borderColor="divider">
            <Typography fontSize="120%" fontWeight="bold">Razem:</Typography>
            <Typography fontSize="120%" fontWeight="bold">
              {order.reduce((sum, item) => sum + item.option.price * item.quantity, 0).toFixed(2)} $
            </Typography>
          </Box>
        </Stack>
      )}
    </SectionCard>
  </>)
}

export default ServiceSelectionCard;
