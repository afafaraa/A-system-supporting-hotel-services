import {SectionCard} from "../../../theme/styled-components/SectionCard.ts";
import Box from "@mui/system/Box";
import {Button, ButtonGroup, Grid, MenuItem, Select, SelectChangeEvent, Stack, Typography} from "@mui/material";
import {Dispatch, SetStateAction, useState} from "react";
import {OptionObject, SelectionAttributes, SelectionAttributesResponse} from "../../../types/service_type_attributes.ts"
import {onAddToCartFunction} from "./ServiceAttributeDetails.tsx";


interface OrderItem {
  option: OptionObject;
  group: string;
  quantity: number;
}

interface Props {
  details: SelectionAttributes;
  onAddToCart: onAddToCartFunction;
}

function ServiceSelectionCard({details, onAddToCart}: Props) {
  const [order, setOrder] = useState<OrderItem[]>([]);

  return (<>
    <SelectionCard details={details} setOrder={setOrder} />
    <OrderSummary details={details} order={order} setOrder={setOrder} onAddToCart={onAddToCart} />
  </>)
}

const SelectionCard = ({details, setOrder}: {details: SelectionAttributes, setOrder: Dispatch<SetStateAction<OrderItem[]>>}) => {
  return (
    <SectionCard>
      <p>Type: {details.type}</p>
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
                    {details.multipleSelection ?
                      <OptionCardButtons group={key} option={option} setOrder={setOrder}/> :
                      <OptionCardSingleButton group={key} option={option} setOrder={setOrder}/>
                    }
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
  );
}

function OptionCardButtons({group, option, setOrder}: {group: string, option: OptionObject, setOrder: Dispatch<SetStateAction<OrderItem[]>>}) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event: SelectChangeEvent) =>
    setQuantity(parseInt(event.target.value));

  const handleAddToOrder = () => {
    setOrder(prev => {
      const itemIndex = prev.findIndex(item => item.option.label === option.label);
      if (itemIndex !== -1) {
        const updatedOrder = [...prev];
        updatedOrder[itemIndex].quantity += quantity;
        return updatedOrder;
      } else {
        return [...prev, {option, group, quantity}];
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

function OptionCardSingleButton({group, option, setOrder}: {
  group: string,
  option: OptionObject;
  setOrder: Dispatch<SetStateAction<OrderItem[]>>
}) {
  const handleAddToOrder = () => {
    setOrder(prev => {
      const itemIndex = prev.findIndex(item => item.option.label === option.label);
      if (itemIndex === -1) return [...prev, {option, group, quantity: 1}];
      return prev;
    })
  }
  return (
    <Button size="small" variant="outlined" onClick={handleAddToOrder} sx={{borderRadius: "12px", mt: 1}}>
      Dodaj do zamówienia
    </Button>
  );
}

const OrderSummary = ({details, order, setOrder, onAddToCart}: {details: SelectionAttributes, order: OrderItem[], setOrder: Dispatch<SetStateAction<OrderItem[]>>, onAddToCart: onAddToCartFunction}) => {

  const handleAddQuantityButton = (option: OptionObject, value: number) => {
    setOrder(prev => {
      const itemIndex = prev.findIndex(item => item.option.label === option.label);
      if (itemIndex === -1) return prev;

      const newQuantity = prev[itemIndex].quantity + value;
      if (newQuantity < 1) return [...prev].filter(item => item.option.label !== option.label);

      const updatedOrder = [...prev];
      updatedOrder[itemIndex].quantity = newQuantity;
      return updatedOrder;
    })
  }

  const handleOrderButton = () => {
    const packedOrder: SelectionAttributesResponse = {
      type: details.type,
      selectedOptions: Object.fromEntries(order.map(item => [item.group + '.' + item.option.label, item.quantity])),
    }
    onAddToCart(packedOrder);
    setOrder([]);
  }

  return (
    <SectionCard mt="inherit">
      {order.length === 0 ? <Typography fontSize="110%">Brak wybranych opcji</Typography> : (
        <Stack gap={2}>
          {order.map((item, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography fontSize="110%" fontWeight="500"
                            display={details.multipleSelection ? "block" : "inline-block"}>{item.option.label}</Typography>
                {details.multipleSelection ?
                  <Box mt={0.3}>
                    <Typography fontSize="90%" color="text.secondary" display="inline">Ilość: {item.quantity}</Typography>
                    <ButtonGroup variant="outlined" size="small" sx={{ml: 1, height: "20px", "& .MuiButtonGroup-grouped": {minWidth: "34px", fontSize: "1rem"}}}>
                      <Button sx={{borderRadius: "12px"}} onClick={() => handleAddQuantityButton(item.option, 1)}>+</Button>
                      <Button sx={{borderRadius: "12px"}} onClick={() => handleAddQuantityButton(item.option, -1)}>-</Button>
                    </ButtonGroup>
                  </Box> :
                  <Button variant="outlined" size="small" onClick={() => handleAddQuantityButton(item.option, -1)}
                          sx={{ml: 1, borderRadius: "12px", height: "20px", minWidth: "20px", fontSize: "1rem"}}>-</Button>}
              </Box>
              <Typography fontSize="110%" fontWeight="500">{(item.option.price * item.quantity).toFixed(2)} $</Typography>
            </Box>
          ))}
          <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} borderTop="1px solid" borderColor="divider">
            <Typography fontSize="120%" fontWeight="bold">Razem:</Typography>
            <Typography fontSize="120%" fontWeight="bold">
              {order.reduce((sum, item) => sum + item.option.price * item.quantity, 0).toFixed(2)} $
            </Typography>
          </Box>
          <Button variant="contained" onClick={handleOrderButton} sx={{borderRadius: "12px"}}>Dodaj do zamówienia</Button>
        </Stack>
      )}
    </SectionCard>
  );
}

export default ServiceSelectionCard;
