import { useState, useEffect } from 'react';
import { axiosAuthApi } from "../../../middleware/axiosApi.ts";
import { Button, Typography, Box } from "@mui/material";
import { ServiceProps } from "../available-services/AvailableServiceCard.tsx";

type ScheduleProps = {
  id: string;
  employeeFullName: string;
  isOrdered: boolean;
  serviceDate: string;
  weekday: Weekday;
  inCart: boolean;
  status: string;
};

enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

const weekdayMap: Record<string, Weekday> = {
  M: Weekday.MONDAY,
  T: Weekday.TUESDAY,
  W: Weekday.WEDNESDAY,
  Th: Weekday.THURSDAY,
  F: Weekday.FRIDAY,
  S: Weekday.SATURDAY,
  Su: Weekday.SUNDAY,
};

const dayLetters = Object.keys(weekdayMap);

function ScheduleForDate({ service }: { service: ServiceProps }) {
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleProps[]>([]);
  const [day, setDay] = useState<string>(dayLetters[(new Date().getDay() + 6) % 7]);
  const [weekMonday, setWeekMonday] = useState<Date>(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    return monday;
  });

  useEffect(() => {
    fetchSchedule();
  }, [service.id, weekMonday]);

  const addToCart = async (item: ScheduleProps) => {
    let cartItemIdList: string[];

    const stringifiedItems = localStorage.getItem("CART");
    if( stringifiedItems ) {
      const parsedItemIds: string[] = JSON.parse(stringifiedItems);
      if ( parsedItemIds.indexOf(item.id) === -1 ) {
        cartItemIdList = [...JSON.parse(stringifiedItems), item.id];
        localStorage.setItem("CART", JSON.stringify(cartItemIdList));
      }
    } else {
      cartItemIdList = [item.id];
      localStorage.setItem("CART", JSON.stringify(cartItemIdList));
    }
    setSchedule(schedule.map(s =>
      s.id === item.id ? { ...item, inCart: true } : s
    ));
  };

  const removeFromCart = async (item: ScheduleProps) => {
    const stringifiedItems = localStorage.getItem("CART");
    if( stringifiedItems ) {
      let parsedItemIds: string[] = JSON.parse(stringifiedItems);
      if ( parsedItemIds.indexOf(item.id) !== -1 ) {
        parsedItemIds = parsedItemIds.filter((e: string) => {
          return e !== item.id
        });
        localStorage.setItem("CART", JSON.stringify(parsedItemIds));
      }
    }
    setSchedule(schedule.map(s =>
      s.id === item.id ? { ...item, inCart: false } : s
    ));
  };

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await axiosAuthApi(`/schedule/get/week/id/${service.id}`, {
        params: { date: weekMonday.toISOString().split("T")[0] },
      });
      const stringifiedItems = localStorage.getItem("CART");
      let parsedItemIds: string[] = [];
      if( stringifiedItems ) {
        parsedItemIds = JSON.parse(stringifiedItems);
      }
      const scheduleItems = response.data.map((s: ScheduleProps) => {
        return {...s, inCart: parsedItemIds.includes(s.id) };
      });
      setSchedule(scheduleItems);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const changeWeek = async (next: boolean) => {
    setWeekMonday(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (next ? 7 : -7));
      return newDate;
    });
  };

  const formatEndOfWeek = () => {
    const weekEnd = new Date(weekMonday);
    weekEnd.setDate(weekMonday.getDate() + 6);
    return weekEnd.toDateString();
  };

  const selectedWeekday = weekdayMap[day];

  if (loading) {
    return <p>Loading...</p>;
  }
  const filteredSchedule = schedule.filter((item) => item.weekday === selectedWeekday);
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: '1em', color: '#555555' }}>
        {weekMonday.toDateString()} - {formatEndOfWeek()}
      </p>
      <div style={{ display: 'flex', gap: '5px' }}>
        <Button onClick={() => changeWeek(false)} sx={{ minWidth: 'auto', width: '37px', borderRadius: '100%' }}>{'<'}</Button>
        {dayLetters.map((currDay) => (
          <Button
            key={currDay}
            onClick={() => setDay(currDay)}
            sx={{
              minWidth: 'auto',
              width: '37px',
              height: '37px',
              borderRadius: '100%',
              background: currDay === day ? 'black' : '',
              color: currDay === day ? 'white' : '',
            }}
          >
            {currDay}
          </Button>
        ))}
        <Button onClick={() => changeWeek(true)} sx={{ minWidth: 'auto', width: '37px', borderRadius: '100%' }}>{'>'}</Button>
      </div>
      {filteredSchedule.length === 0 ? (
        <Typography>No services available for this day.</Typography>
      ) : (
        filteredSchedule.sort((a,b) => new Date(a.serviceDate).getTime() - new Date(b.serviceDate).getTime()).map((item) => {
          const available = new Date() > new Date(item.serviceDate) || item.status !== 'AVAILABLE';

          return (
            <div key={item.id} style={{ display: 'flex', gap: '5px', opacity: available ? 0.5 : 1, pointerEvents: available ? 'none' : 'auto', width: '100%' }}>
              <Box
                sx={{
                  padding: '10px 15px',
                  borderRadius: '5px',
                  width: {xs: '100%', md:'70%'},
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: '#ddd',
                }}
              >
                <div>{item.employeeFullName}</div>
                <div>
                  {String(new Date(item.serviceDate).getHours()).padStart(2, '0')}:
                  {String(new Date(item.serviceDate).getMinutes()).padStart(2, '0')}
                </div>
              </Box>
              {item.inCart ? (
                <Button
                  onClick={() => removeFromCart(item)}
                  sx={{ minWidth: 'auto', width: '50px', background: '#ddd' }}
                  disabled={available}
                >
                  -
                </Button>
              ) : (
                <Button
                  onClick={() => addToCart(item)}
                  sx={{ minWidth: 'auto', width: '50px', background: '#ddd' }}
                  disabled={available}
                >
                  +
                </Button>
              )}
            </div>
          );
        })
      )}

    </div>
  );
}

export default ScheduleForDate;
